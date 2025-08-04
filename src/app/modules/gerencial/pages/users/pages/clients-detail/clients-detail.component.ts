import { Component, inject, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { LabelAndInfoComponent } from '../../../../../shared/components/label-and-info/label-and-info.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { BooleanStatusPipe } from '../../../../../shared/pipes/boolean-status/boolean-status.pipe';
import { ClientResponse, ClientService } from '../../client.service';

@Component({
  selector: 'app-clients-detail',
  standalone: true,
  templateUrl: './clients-detail.component.html',
  styleUrl: './clients-detail.component.scss',
  imports: [
    MatCardModule,
    MatSlideToggleModule,
    MatTabsModule,
    CommomTableComponent,
    LabelAndInfoComponent,
    PageHeaderComponent,
    BooleanStatusPipe,
  ],
})
export class ClientsDetailComponent implements OnInit {
  @Input() id!: string;

  private clientService = inject(ClientService);
  private toastr = inject(ToastrService);

  public title = 'Clientes';
  public pageSession = 'Detalhes do cliente';
  public client?: ClientResponse;

  ngOnInit(): void {
    this.getClient();
  }

  private getClient(): void {
    this.clientService.getClientById(this.id).subscribe((client) => {
      this.client = client;
    });
  }

  public changeStatus(): void {
    this.clientService.changeStatus(this.id).subscribe(() => {
      this.toastr.success('Status alterado com sucesso');
      this.getClient();
    });
  }

  public displayedColumns: TableColumn[] = [
    { label: 'Data', key: 'data', type: 'text' },
    { label: 'COD', key: 'COD', type: 'text' },
    { label: 'Produto', key: 'produto', type: 'text' },
    { label: 'Valor', key: 'valor', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  public budgets: any[] = [
    {
      id: 1,
      data: '00/00/0000',
      dataAtualizacao: '00/00/0000',
      COD: '000000',
      produto: 'João Carlos',
      valor: 1000,
      status: 'Aprovado',
    },
    {
      id: 2,
      data: '00/00/0000',
      dataAtualizacao: '00/00/0000',
      COD: '000000',
      produto: 'Marlúcia Amorin',
      valor: 1000,
      status: 'Finalizado',
    },
    {
      id: 3,
      data: '00/00/0000',
      dataAtualizacao: '00/00/0000',
      COD: '000000',
      produto: 'João Carlos',
      valor: 1000,
      status: 'Aprovado',
    },
    {
      id: 4,
      data: '00/00/0000',
      dataAtualizacao: '00/00/0000',
      COD: '000000',
      produto: 'Marlúcia Amorin',
      valor: 1000,
      status: 'Finalizado',
    },
  ];
}
