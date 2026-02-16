import { ActivatedRoute, Router } from '@angular/router';
import { CommomTableComponent, TableColumn } from '../../../../../../shared/components/commom-table/commom-table.component';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FilterOption, MultipleFilterTableComponent, ViewMode } from '../../../../../../shared/components/multiple-filter-table/multiple-filter-table.component';

import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { PageHeaderComponent } from '../../../../../../shared/components/page-header/page-header.component';
import { ToastrService } from 'ngx-toastr';

export interface CampaignData {
  id: number
  date: string
  time: string
  name: string
  sends: number
  impacted: number
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
    DashboardComponent,
    MatButtonModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  public data = signal<CampaignData[]>([]);

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
    this.getCampaigns();
  }

  private getCampaigns(search?: string) {
    let data: any[] = [];
    
    for(let i = 0; i < 10; i++) {
      data.push({
        id: i,
        date: '00/00/00',
        time: '00:00',
        campaignName: 'Título da Campanha',
        sendes: '000',
        impacteds: '000',
        status: i % 2 === 0 ? "Finalizada" : "Em andamento"
      })
    }

    this.data.set(data);
  }

  public onViewModeChange(mode: ViewMode) {
    this.viewMode = mode
  }

  public onFilterChange(filters: any) {
    console.log('Filters changed:', filters)
  }

  public gotoCreatePage() {
    this.router.navigate(['form'], { relativeTo: this.activatedRoute })
  }

  public gotoDetailPage(row: any) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
  }

  gotoEditPage(row: any) {
    this.router.navigate(['/admin/clients/edit', row.id])
  }

  deleteRow(row: any) {
    const deleteUser = confirm('Deseja deletar esse usuário?');
    
    if (deleteUser) {
      this.toastr.success('Cliente excluído com sucesso!')
    }
  }
}
