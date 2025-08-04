import { Component } from '@angular/core';
import { FeatureCardComponent } from './components/feature-card/feature-card.component';

@Component({
  selector: 'app-feature-section',
  standalone: true,
  templateUrl: './feature-section.component.html',
  styleUrl: './feature-section.component.scss',
  imports: [
    FeatureCardComponent,
  ],
})
export class FeatureSectionComponent {

}
