import { Component, inject, computed } from '@angular/core';
import { PresenterStateService } from '../../../../core/services/presenter-state.service';
import { SphereListComponent } from '../sphere-list/sphere-list.component';
import { CarouselControlsComponent } from '../carousel-controls/carousel-controls.component';
import { CarouselItem } from '../../models/model';

@Component({
  selector: 'app-carousel-container',
  standalone: true,
  imports: [SphereListComponent, CarouselControlsComponent],
  templateUrl: './carousel-container.component.html',
  styleUrl: './carousel-container.component.scss'
})
export class CarouselContainerComponent {
  private readonly stateService = inject(PresenterStateService);

  readonly loading = this.stateService.loading;
  readonly error = this.stateService.error;
  readonly names = this.stateService.names;

  readonly carouselItems = computed<CarouselItem[]>(() => {
    this.stateService.names();
    this.stateService.currentIndex();
    return this.stateService.getCarouselWindow(3);
  });

  skip(): void {
    this.stateService.skip();
  }

  // previous(): void {
  //   this.stateService.previous();
  // }
}
