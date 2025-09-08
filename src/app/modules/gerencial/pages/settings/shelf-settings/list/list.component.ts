import { Component, inject, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { CommomTableComponent, TableColumn } from "../../../../../shared/components/commom-table/commom-table.component";
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    PageHeaderComponent,
    CommomTableComponent,
    FilterTableComponent,
    BaseButtonComponent
],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private readonly router = inject(Router);
  public data = signal<any[]>([]);

  public displayedColumns: TableColumn[] = [
    { label: 'COD', key: 'id', type: 'text' },
    { label: 'Produto', key: 'product', type: 'text' },
    { label: 'Pontuação resgate', key: 'pointsRescue', type: 'text' },
    { label: 'Vencimento', key: 'validity', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  constructor() {
    this.getData();
  }

  getData() {
    const data = [];

    for(let i = 0; i < 10; i++) {
      data.push({
        id: i,
        product: 'Nome do produto',
        pointsRescue: '000000',
        validity: '00/00/00',
        status: i % 2 === 0 ? 'Ativo' : 'Desativado'
      })
    }

    this.data.set(data);
  }

  gotoEditPage(row: any) {}

  gotoDetailPage(row: any) {
    this.router.navigate([`gerencial/configuracao/prateleira/${row.id}`])
  }

  deleteRow(row: any) {}

  

}
