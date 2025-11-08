import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseButtonComponent } from '../../../../shared/components/base-button/base-button.component';
import { CommomTableComponent, TableColumn } from '../../../../shared/components/commom-table/commom-table.component';
import { FilterTableComponent } from '../../../../shared/components/filter-table/filter-table.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { AccessService, AccessAdminDto } from '../access.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
  private accessService = inject(AccessService);
  private toastr = inject(ToastrService);

  public data = signal<any[]>([]);
  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);

  public displayedColumns: TableColumn[] = [
    { label: 'ID', key: 'id', type: 'text' },
    { label: 'Nome', key: 'name', type: 'text' },
    { label: 'Email', key: 'email', type: 'text' },
    { label: 'Função', key: 'role', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  constructor() {
    this.loadAccess();
  }

  private loadAccess(search?: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.accessService
      .getAccessList(undefined, undefined, search)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.data.set(this.mapAdmins(response.admins ?? []));
        },
        error: (error) => {
          console.error('Erro ao carregar acessos', error);
          this.toastr.error('Não foi possível carregar a lista de acessos.');
          this.errorMessage.set('Não foi possível carregar a lista de acessos.');
          this.data.set([]);
        },
      });
  }

  public onFilter(search: string): void {
    this.loadAccess(search);
  }

  private mapAdmins(admins: AccessAdminDto[]) {
    return admins.map((admin) => ({
      id: admin.id,
      name: admin.name ?? '-',
      email: admin.email ?? '-',
      role: this.formatRole(admin.role),
      status: this.formatStatus(admin.status),
    }));
  }

  private formatRole(role?: string | null): string {
    if (!role) {
      return '-';
    }

    const normalized = role.toUpperCase();

    switch (normalized) {
      case 'MASTER':
        return 'Master';
      case 'ADMIN':
        return 'Administrador';
      case 'MANAGER':
        return 'Gerente';
      default:
        return role;
    }
  }

  private formatStatus(status?: string | null): string {
    if (!status) {
      return '-';
    }

    return status === 'ACTIVE' ? 'Ativo' : 'Inativo';
  }

  private formatDate(date?: string | null): string {
    if (!date) {
      return '-';
    }

    const parsed = new Date(date);

    if (isNaN(parsed.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(parsed);
  }

  gotoEditPage(row: any) {
    if (!row?.id) {
      return;
    }

    this.router.navigate(['form', row.id], { relativeTo: this.activatedRoute })
  }

  gotoDetailPage(row: any) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute })
  }

  deleteRow(row: any) {}
}
