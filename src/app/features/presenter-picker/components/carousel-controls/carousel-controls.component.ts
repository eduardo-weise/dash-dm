import { Component, output } from '@angular/core';

@Component({
  selector: 'app-carousel-controls',
  standalone: true,
  templateUrl: './carousel-controls.component.html',
  styleUrl: './carousel-controls.component.scss'
})
export class CarouselControlsComponent {
  readonly skip = output<void>();
  readonly previous = output<void>();

  onSkip(): void {
    this.skip.emit();
  }

  // onPrevious(): void {
  //   this.previous.emit();
  // }
}
