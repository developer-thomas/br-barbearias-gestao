import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.scss',
  imports: [
    MatCardModule,
  ],
})
export class FeatureCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) imageUrl!: string;
}
