import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ClientResponse, ClientService } from '../../client.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss',
  imports: [
    FilterTableComponent,
    CommomTableComponent,
    RouterLink,
    PageHeaderComponent,
    BaseButtonComponent,
  ],
})
export class ClientsListComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private clientService = inject(ClientService);
  private toastr = inject(ToastrService);
  public title = 'Clientes';
  public pageSession = 'Clientes';

  public clients = signal<any[]>([]);

  public displayedColumns: TableColumn[] = [
    { label: 'ID', key: 'id', type: 'text' },
    { label: 'Nome', key: 'name', type: 'text' },
    { label: 'Tempo fidelidade', key: 'fidelityTime', type: 'text' },
    { label: 'Tempo que não vai à barbearia', key: 'timeFarAway', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit() {
    this.getClients();
  }

  private getClients(search?: string) {
    let data: any[] = [];
    
    for(let i = 0; i < 10; i++) {
      data.push({
        id: i,
        name: 'Anderson',
        fidelityTime: '3 meses',
        timeFarAway: '20 dias'
      })
    }

    this.clients.set(data);
  }

  public filter(search: string) {
    this.getClients(search);
  }

  public gotoDetailPage(row: any) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
  }

  gotoEditPage(row: any) {
    this.router.navigate(['/admin/clients/edit', row.id])
  }

  deleteClient(row: any) {
    const deleteUser = confirm('Deseja deletar esse usuário?');
    if (deleteUser) {
      this.clientService.deleteClient(row.id);
      this.toastr.success('Cliente excluído com sucesso!')
    }

    return

  }
}
