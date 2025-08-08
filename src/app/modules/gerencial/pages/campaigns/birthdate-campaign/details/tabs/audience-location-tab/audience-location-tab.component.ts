import { Component, Input } from '@angular/core';

interface AudienceLocation {
  dateFrom: number;
  ageUntil: number;
  gender: string;
  location: string;
}

@Component({
  selector: 'app-audience-location-tab',
  standalone: true,
  imports: [],
  templateUrl: './audience-location-tab.component.html',
  styleUrl: './audience-location-tab.component.scss'
})
export class AudienceLocationTabComponent {

  @Input() data: AudienceLocation = {
    dateFrom: 20,
    ageUntil: 50,
    gender: 'Homens e Mulheres',
    location: 'Bahia, Salvador'
  }
}
