import { Component, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { CommomTableComponent, TableColumn } from "../../../../../shared/components/commom-table/commom-table.component";
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';

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

  gotoDetailPage(row: any) {}

  deleteRow(row: any) {}

  

}
