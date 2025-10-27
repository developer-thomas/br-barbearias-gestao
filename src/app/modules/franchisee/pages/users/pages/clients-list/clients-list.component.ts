import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ClientService, ClientSummary } from '../../client.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss',
  imports: [
    FilterTableComponent,
    CommomTableComponent,
    PageHeaderComponent,
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
  public isLoading = signal(false);
  private readonly defaultPage = 1;
  private readonly defaultPageSize = 20;

  public displayedColumns: TableColumn[] = [
    { label: 'ID', key: 'id', type: 'text' },
    { label: 'Nome', key: 'name', type: 'text' },
    { label: 'Tempo fidelidade', key: 'fidelityTime', type: 'text' },
    { label: 'Tempo que não vai à barbearia', key: 'timeFarAway', type: 'text' },
  ];

  ngOnInit() {
    this.getClients();
  }

  private getClients(search?: string) {
    this.isLoading.set(true);
    this.clientService
      .getClients(this.defaultPage, this.defaultPageSize, search)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          const mappedClients = this.mapClientsToTable(response?.clients ?? []);
          this.clients.set(mappedClients);
        },
        error: (error) => {
          console.error('Erro ao carregar clientes', error);
          this.toastr.error('Não foi possível carregar a lista de clientes.');
          this.clients.set([]);
        },
      });
  }

  private mapClientsToTable(clients: ClientSummary[]) {
    return clients.map((client) => ({
      id: client.id,
      name: client.name ?? '-',
      fidelityTime: this.formatDate(client.membershipStatedAt),
      timeFarAway: this.formatRelativeTime(client.lastVisit),
    }));
  }

  private formatDate(date?: string | null) {
    if (!date) {
      return '-';
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(parsedDate);
  }

  private formatRelativeTime(date?: string | null) {
    if (!date) {
      return '-';
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return '-';
    }

    const now = new Date();
    const diffMs = now.getTime() - parsedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return 'Hoje';
    }

    if (diffDays === 1) {
      return '1 dia';
    }

    return `${diffDays} dias`;
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
