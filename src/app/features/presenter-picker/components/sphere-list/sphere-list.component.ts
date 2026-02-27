import { Component, Input } from '@angular/core';
import { CarouselItem } from '../../models';

@Component({
  selector: 'app-sphere-list',
  standalone: true,
  templateUrl: './sphere-list.component.html',
  styleUrl: './sphere-list.component.scss'
})
export class SphereListComponent {
  @Input({ required: true }) items: CarouselItem[] = [];

  getScale(position: number): number {
    const abs = Math.abs(position);
    if (abs === 0) return 1;
    if (abs === 1) return 0.85;
    return 0.7;
  }

  getOpacity(position: number): number {
    const abs = Math.abs(position);
    if (abs === 0) return 1;
    if (abs === 1) return 0.6;
    return 0.35;
  }
}
