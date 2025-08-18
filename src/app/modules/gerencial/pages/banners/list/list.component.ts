import { Component, inject, signal } from '@angular/core';
import { BaseButtonComponent } from '../../../../shared/components/base-button/base-button.component';
import { CommomTableComponent, TableColumn } from '../../../../shared/components/commom-table/commom-table.component';
import { FilterTableComponent } from '../../../../shared/components/filter-table/filter-table.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ActivatedRoute, Router } from '@angular/router';

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
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  public data = signal<any[]>([]);

  public displayedColumns: TableColumn[] = [
    { label: 'Data inicial', key: 'initialDate', type: 'text' },
    { label: 'Data final', key: 'endDate', type: 'text' },
    { label: 'Nome', key: 'name', type: 'text' },
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
        initialDate: '00/00/00',
        endDate: '00/00/00',
        name: 'Nome do banner',
        status: i % 2 === 0 ? 'Ativo' : 'Desativado'
      })
    }

    this.data.set(data);
  }

  gotoEditPage(row: any) {
    // Ajustar para redirecionar para um novo component de editar na integração
    this.router.navigate(['form'], { relativeTo: this.activatedRoute })

  }

  gotoDetailPage(row: any) {
    console.log(row)
    this.router.navigate([row.id], { relativeTo: this.activatedRoute })
  }

  deleteRow(row: any) {}

  

}
