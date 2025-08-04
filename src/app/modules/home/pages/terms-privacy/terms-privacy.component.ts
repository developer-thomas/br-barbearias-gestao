import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-terms-privacy',
  standalone: true,
  imports: [],
  templateUrl: './terms-privacy.component.html',
  styleUrl: './terms-privacy.component.scss',
})
export class TermsPrivacyComponent {
  @Input() type!: string;
}
