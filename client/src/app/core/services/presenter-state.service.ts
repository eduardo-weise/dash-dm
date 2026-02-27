import { inject, Injectable, signal, computed } from '@angular/core';
import { PresenterState } from '../../features/presenter-picker/models';
import { GistService } from './gist.service';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function sortNames(names: string[]): string[] {
  return [...names].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

/**
 * Conta apenas dias úteis (seg–sex) entre duas datas ISO (exclusivo → inclusivo).
 * Ex.: countBusinessDays('2026-02-27', '2026-03-02') → 1 (somente sex 27 não conta, seg 02 conta)
 */
function countBusinessDays(fromDate: string, toDate: string): number {
  let count = 0;
  const current = new Date(fromDate);
  const end = new Date(toDate);
  // começa no dia seguinte ao fromDate
  current.setDate(current.getDate() + 1);
  while (current <= end) {
    const day = current.getDay(); // 0=dom, 6=sáb
    if (day !== 0 && day !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

@Injectable({ providedIn: 'root' })
export class PresenterStateService {
  private readonly gist = inject(GistService);

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

  /** Recarrega o estado do Gist (útil para sincronizar entre abas). */
  reload(): void {
    this.load();
  }

  private async load(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await this.gist.read();
      const names = Array.isArray(data.names) ? sortNames(data.names) : [];
      const n = names.length;

      let currentIndex = typeof data.currentIndex === 'number' ? data.currentIndex : 0;
      let lastAdvancedDate =
        typeof data.lastAdvancedDate === 'string' ? data.lastAdvancedDate : todayISO();

      const today = todayISO();

      // Rotação automática: avança somente por dias úteis (seg–sex)
      if (n > 0 && lastAdvancedDate < today) {
        const businessDays = countBusinessDays(lastAdvancedDate, today);
        if (businessDays > 0) {
          currentIndex = (currentIndex + businessDays) % n;
          lastAdvancedDate = today;

          // Persiste avanço automático no Gist
          const updated: PresenterState = { names, currentIndex, lastAdvancedDate };
          await this.gist.update(updated);
        }
      }

      this._state.set({ names, currentIndex, lastAdvancedDate });
    } catch (err) {
      this._error.set(err instanceof Error ? err.message : 'Falha ao carregar dados do Gist');
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
    const updated: PresenterState = { ...s, currentIndex: newIndex };

    // Atualiza UI imediatamente (otimista)
    this._state.set(updated);
    this._saving.set(true);

    try {
      await this.gist.update(updated);
    } catch (err) {
      // Reverte em caso de falha
      this._state.set(s);
      this._error.set(err instanceof Error ? err.message : 'Falha ao salvar no Gist');
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
