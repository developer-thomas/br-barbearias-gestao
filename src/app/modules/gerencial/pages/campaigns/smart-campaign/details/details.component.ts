import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { AudienceLocationTabComponent } from './tabs/audience-location-tab/audience-location-tab.component';
import { PeriodProductTabComponent } from './tabs/period-product-tab/period-product-tab.component';
import { PositioningTabComponent } from './tabs/positioning-tab/positioning-tab.component';
import { ResultsTabComponent } from './tabs/results-tab/results-tab.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    ResultsTabComponent,
    PeriodProductTabComponent,
    AudienceLocationTabComponent,
    PositioningTabComponent,
    PageHeaderComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  campaign = {
    imageUrl: "assets/png/default-user.png",
    title: "Marina Silva",
    type: "Comum",
    repeats: "Sim",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  }

  constructor() {
    const campaignId = this.route.snapshot.paramMap.get("id")
    console.log("Campaign ID:", campaignId)
  }
}
