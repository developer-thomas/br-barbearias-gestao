import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommomTableComponent, TableColumn } from '../../../../../../shared/components/commom-table/commom-table.component';
import { PageHeaderComponent } from '../../../../../../shared/components/page-header/page-header.component';
import { FilterOption, MultipleFilterTableComponent, ViewMode } from '../../../../../../shared/components/multiple-filter-table/multiple-filter-table.component';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { finalize } from 'rxjs';
import { CommonCampaignService, CommonCampaignListItem, CommonCampaignListResponse } from '../../common-campaign.service';

export interface CampaignData {
  id: number
  date: string
  time: string
  campaignName: string
  sendes: string
  impacteds: string
  status: 'Em andamento' | 'Finalizada'
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    PageHeaderComponent,
    CommomTableComponent,
    MultipleFilterTableComponent,
    CommonModule,
    DashboardComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private commonCampaignService = inject(CommonCampaignService);

  public data = signal<CampaignData[]>([]);
  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);
  public totalItems = signal(0);
  public pageIndex = signal(0);
  public pageSize = signal(10);

  public viewMode: ViewMode = 'list';

  public displayedColumns: TableColumn[] = [
    { label: 'Data', key: 'date', type: 'text' },
    { label: 'Horário', key: 'time', type: 'text' },
    { label: 'Nome da campanha', key: 'campaignName', type: 'text' },
    { label: 'Envios', key: 'sendes', type: 'text' },
    { label: 'Impactados', key: 'impacteds', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];

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
    this.loadCampaigns();
  }

  private loadCampaigns(page: number = 1, size: number = this.pageSize()): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.commonCampaignService
      .getCommonCampaigns({ page, take: size })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: CommonCampaignListResponse) => {
          const campaigns = this.mapCampaigns(response.items ?? []);
          this.data.set(campaigns);
          this.totalItems.set(response.count ?? campaigns.length);
          this.pageIndex.set(Math.max(page - 1, 0));
          this.pageSize.set(size);
        },
        error: (error: unknown) => {
          console.error('Erro ao carregar campanhas comuns', error);
          this.toastr.error('Não foi possível carregar as campanhas.');
          this.errorMessage.set('Não foi possível carregar as campanhas.');
          this.data.set([]);
          this.totalItems.set(0);
          this.pageIndex.set(0);
        }
      });
  }

  public onViewModeChange(mode: ViewMode) {
    this.viewMode = mode
  }

  public onFilterChange(filters: any) {
    console.log('Filters changed:', filters)
  }

  public onPageChange(event: { page: number; size: number }): void {
    this.loadCampaigns(event.page, event.size);
  }

  public gotoCreatePage() {
    this.router.navigate(['form'], { relativeTo: this.activatedRoute })
  }

  public gotoDetailPage(row: any) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
  }

  gotoEditPage(row: any) {
    this.toastr.info('Edição de campanhas comuns não está disponível no momento.');
  }

  deleteRow(row: any) {
    this.toastr.info('Remoção de campanhas comuns não está disponível no momento.');
  }

  private mapCampaigns(items: CommonCampaignListItem[]): CampaignData[] {
    return items.map((item) => ({
      id: item.id,
      date: this.formatDate(item.createdAt),
      time: this.formatHour(item.hour),
      campaignName: item.name ?? '-',
      sendes: this.formatNumber(item.sent),
      impacteds: this.formatNumber(item.impact),
      status: this.formatStatus(item.status)
    }));
  }

  private formatDate(dateIso: string | null | undefined): string {
    if (!dateIso) {
      return '-';
    }

    const parsed = new Date(dateIso);

    if (Number.isNaN(parsed.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat('pt-BR').format(parsed);
  }

  private formatHour(hour: number | null | undefined): string {
    if (hour === null || hour === undefined || Number.isNaN(Number(hour))) {
      return '-';
    }

    const normalized = Math.max(0, Math.min(23, Math.floor(Number(hour))));
    return `${normalized.toString().padStart(2, '0')}:00`;
  }

  private formatStatus(status: string | null | undefined): 'Em andamento' | 'Finalizada' {
    if (!status) {
      return 'Em andamento';
    }

    const normalized = status.toUpperCase();

    if (normalized === 'ACTIVE' || normalized === 'RUNNING' || normalized === 'PENDING') {
      return 'Em andamento';
    }

    return 'Finalizada';
  }

  private formatNumber(value: number | null | undefined): string {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return '-';
    }

    return Number(value).toLocaleString('pt-BR');
  }
}
