import { Component, Input } from '@angular/core';
import { CarouselItem } from '../../models';

@Component({
	selector: 'app-sphere-list',
	standalone: true,
	templateUrl: './sphere-list.component.html',
	styleUrl: './sphere-list.component.scss',
})
export class SphereListComponent {
	@Input({ required: true }) items: CarouselItem[] = [];

	getTransform(position: number): string {
		const scale = this.getScale(position);
		const yOffset = position * 2.5;
		return `translateX(-50%) translateY(calc(-50% + ${yOffset}rem)) scale(${scale})`;
	}

	getScale(position: number): number {
		const abs = Math.abs(position);
		if (abs === 0) return 1;
		if (abs === 1) return 0.65;
		if (abs === 2) return 0.4;
		return 0.2;
	}

	getOpacity(position: number): number {
		const abs = Math.abs(position);
		if (abs === 0) return 1;
		if (abs === 1) return 0.6;
		if (abs === 2) return 0.35;
		return 0;
	}
}
