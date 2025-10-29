import { Component, OnInit, inject, signal } from '@angular/core';
import { FilterOption, MultipleFilterTableComponent } from '../../../../shared/components/multiple-filter-table/multiple-filter-table.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { finalize } from 'rxjs';
import { RankingResponseItem, RankingService } from '../ranking.service';
import { ToastrService } from 'ngx-toastr';

export interface CampaignData {
  id: number
  position: number
  name: string
  image: string
  points: number
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MultipleFilterTableComponent,
    PageHeaderComponent,
    CommonModule,
    MatCardModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private rankingService = inject(RankingService);
  private toastr = inject(ToastrService);

  public data = signal<CampaignData[]>([]);
  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);

  public filters: FilterOption[] = [
    {
      label: 'Todas filiais',
      value: 'all',
      icon: 'business',
      type: 'button'
    },
    {
      label: 'Tipo',
      value: 'tipo',
      type: 'select',
      options: [
        { label: 'Tipo', value: 'tipo' },
        { label: 'Comum', value: 'comum' },
        { label: 'Especial', value: 'especial' }
      ]
    },
    {
      label: 'Todos',
      value: 'todos',
      icon: 'filter_list',
      type: 'button'
    },
    {
      label: 'Período',
      value: 'periodo',
      icon: 'calendar_today',
      type: 'date'
    }
  ]

  public columnFilters = [
    { label: 'Data', options: ['Mais recente', 'Mais antiga'] },
    { label: 'Horário', options: ['Crescente', 'Decrescente'] },
    { label: 'Nome da campanha', options: ['A-Z', 'Z-A'] },
    { label: 'Envios', options: ['Maior', 'Menor'] },
    { label: 'Impactados', options: ['Maior', 'Menor'] },
    { label: 'Status', options: ['Em andamento', 'Finalizada', 'Todos'] }
  ]

  ngOnInit() {
    this.loadRanking();
  }

  private loadRanking(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.rankingService
      .getRanking()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.data.set(this.mapRankingResponse(response));
        },
        error: (error) => {
          console.error('Erro ao carregar ranking', error);
          this.toastr.error('Não foi possível carregar o ranking.');
          this.errorMessage.set('Não foi possível carregar o ranking.');
          this.data.set([]);
        },
      });
  }

  private mapRankingResponse(response: RankingResponseItem[]): CampaignData[] {
    if (!Array.isArray(response)) {
      return [];
    }

    const sorted = [...response].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));

    return sorted.map((item, index) => ({
      id: item.id,
      position: index,
      name: item.name ?? '-',
      image: item.imageUrl ?? 'assets/png/default-user.png',
      points: item.points ?? 0,
    }));
  }

  public onFilterChange(filters: any) {
    console.log('Filters changed:', filters)
  }
}
