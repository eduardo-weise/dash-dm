import { Component } from '@angular/core';
import { CarouselContainerComponent } from '../carousel-container/carousel-container.component';

@Component({
  selector: 'app-presenter-page',
  standalone: true,
  imports: [CarouselContainerComponent],
  templateUrl: './presenter-page.component.html',
  styleUrl: './presenter-page.component.scss'
})
export class PresenterPageComponent {}
