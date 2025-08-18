import { Component, OnInit, signal } from '@angular/core';
import { FilterOption, MultipleFilterTableComponent } from '../../../../shared/components/multiple-filter-table/multiple-filter-table.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

export interface CampaignData {
  id: number
  position: string
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
  public data = signal<CampaignData[]>([]);

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
        position: i,
        name: 'Nome da filial',
        image: 'assets/png/default-user.png',
        points: '00000'
      })
    }

    this.data.set(data);
  }

  public onFilterChange(filters: any) {
    console.log('Filters changed:', filters)
  }
}
