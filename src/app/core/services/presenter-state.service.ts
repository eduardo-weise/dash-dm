import { inject, Injectable, signal, computed } from '@angular/core';
import { PresenterState } from '../../features/presenter-picker/models/model';
import { DatabaseService } from './database.service';
import { firstValueFrom } from 'rxjs';

function todayISO(): string {
	return new Date().toISOString().slice(0, 10);
}

function sortNames(names: string[]): string[] {
	return [...names].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

function countBusinessDays(fromDate: string, toDate: string): number {
	let count = 0;
	const current = new Date(fromDate + 'T00:00:00Z');
	const end = new Date(toDate + 'T00:00:00Z');

	current.setUTCDate(current.getUTCDate() + 1);

	while (current <= end) {
		const day = current.getUTCDay();
		if (day !== 0 && day !== 6) { // 0 = Sunday, 6 = Saturday
			count++;
		}
		current.setUTCDate(current.getUTCDate() + 1);
	}
	return count;
}

@Injectable({ providedIn: 'root' })
export class PresenterStateService {
	private readonly database = inject(DatabaseService);

	private readonly _state = signal<PresenterState | null>(null);
	private readonly _loading = signal(true);
	private readonly _error = signal<string | null>(null);
	private readonly _saving = signal(false);

	readonly state = this._state.asReadonly();
	readonly loading = this._loading.asReadonly();
	readonly error = this._error.asReadonly();
	readonly saving = this._saving.asReadonly();

	readonly names = computed(() => this._state()?.names ?? []);
	readonly currentIndex = computed(() => this._state()?.currentIndex ?? 0);

	readonly currentPresenter = computed(() => {
		const s = this._state();
		if (!s?.names.length) return null;
		return s.names[s.currentIndex % s.names.length] ?? null;
	});

	constructor() {
		this.load();
	}

	reload(): void {
		this.load();
	}

	private async load(): Promise<void> {
		this._loading.set(true);
		this._error.set(null);
		try {
			let data = await firstValueFrom(this.database.read());

			if (!data) {
				const initialState: PresenterState = {
					names: [],
					currentIndex: 0,
					lastAdvancedDate: todayISO(),
				};
				this._state.set(initialState);
				await firstValueFrom(this.database.update(initialState));
				data = initialState;
			}

			const names = Array.isArray(data.names) ? sortNames(data.names) : [];
			const n = names.length;

			let currentIndex = typeof data.currentIndex === 'number' ? data.currentIndex : 0;
			let lastAdvancedDate =
				typeof data.lastAdvancedDate === 'string' ? data.lastAdvancedDate : todayISO();

			const today = todayISO();

			if (n > 0 && lastAdvancedDate < today) {
				const businessDays = countBusinessDays(lastAdvancedDate, today);
				if (businessDays > 0) {
					currentIndex = (currentIndex + businessDays) % n;
					lastAdvancedDate = today;

					const updated: PresenterState = { names, currentIndex, lastAdvancedDate };
					await firstValueFrom(this.database.update(updated));
				}
			}
			this._state.set({ names, currentIndex, lastAdvancedDate });
		} catch (err) {
			this._error.set(err instanceof Error ? err.message : 'Falha ao carregar dados do banco de dados');
			this._state.set({ names: [], currentIndex: 0, lastAdvancedDate: todayISO() });
		} finally {
			this._loading.set(false);
		}
	}

	async skip(): Promise<void> {
		const s = this._state();
		if (!s || s.names.length === 0) return;

		const n = s.names.length;
		const newIndex = (s.currentIndex + 1) % n;
		const updated: PresenterState = { ...s, currentIndex: newIndex, lastAdvancedDate: todayISO() };

		this._state.set(updated);
		this._saving.set(true);

		try {
			await firstValueFrom(this.database.update(updated));
		} catch (err) {
			this._state.set(s);
			this._error.set(err instanceof Error ? err.message : 'Falha ao salvar no banco de dados');
		} finally {
			this._saving.set(false);
		}
	}

	getCarouselWindow(radius = 2): { name: string; position: number }[] {
		const s = this._state();
		if (!s?.names.length) return [];
		const n = s.names.length;
		const result: { name: string; position: number }[] = [];
		for (let offset = -radius; offset <= radius; offset++) {
			const idx = (s.currentIndex + offset + n * 10) % n;
			result.push({ name: s.names[idx], position: offset });
		}
		return result;
	}
}
