import { ActivatedRoute, Router } from '@angular/router';
import { CommonCampaignDetails, CommonCampaignService } from '../common-campaign.service';
import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { AudienceLocationTabComponent } from './audience-location-tab/audience-location-tab.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { PeriodProductTabComponent } from './period-product-tab/period-product-tab.component';
import { PositioningTabComponent } from './positioning-tab/positioning-tab.component';
import { ResultsTabComponent } from './results-tab/results-tab.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    MatTabsModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    ResultsTabComponent,
    PeriodProductTabComponent,
    AudienceLocationTabComponent,
    PositioningTabComponent
  ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private commonCampaignService = inject(CommonCampaignService);

  campaignId = signal<number | null>(null);
  campaignDetails = signal<CommonCampaignDetails | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  campaign = computed(() => {
    const details = this.campaignDetails();
    if (!details) {
      return {
        imageUrl: 'assets/images/placeholder.jpg',
        title: 'Carregando...',
        type: '-',
        repeats: '-',
        description: '...'
      };
    }
    return {
      imageUrl: details.fileUrl || 'assets/images/placeholder.jpg',
      title: details.name,
      type: this.formatCampaignType(details.type),
      repeats: details.isRecurring ? 'Sim' : 'Não',
      description: details.description
    };
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.campaignId.set(+id);
      this.loadCampaignDetails(+id);
    } else {
      this.toastr.error('ID da campanha não encontrado.');
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  loadCampaignDetails(id: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.commonCampaignService.getCommonCampaignById(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.campaignDetails.set(data);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Falha ao carregar os detalhes da campanha.');
          this.toastr.error('Falha ao carregar os detalhes da campanha.');
        }
      });
  }

  formatCampaignType(type: string): string {
    if (type === 'COMMON') return 'Comum';
    return type;
  }
}
