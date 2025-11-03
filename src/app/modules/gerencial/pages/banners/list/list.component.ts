import { Component, inject, signal } from '@angular/core';
import { BaseButtonComponent } from '../../../../shared/components/base-button/base-button.component';
import { CommomTableComponent, TableColumn } from '../../../../shared/components/commom-table/commom-table.component';
import { FilterTableComponent } from '../../../../shared/components/filter-table/filter-table.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BannersService, AdminBannerDto } from '../banners.service';
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
  private bannersService = inject(BannersService);
  private toastr = inject(ToastrService);

  public data = signal<any[]>([]);
  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);
  public totalItems = signal<number>(0);
  public totalPages = signal<number>(0);

  public displayedColumns: TableColumn[] = [
    { label: 'Data inicial', key: 'initialDate', type: 'text' },
    { label: 'Data final', key: 'endDate', type: 'text' },
    { label: 'Nome', key: 'name', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  constructor() {
    this.loadBanners();
  }

  private loadBanners(search?: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.bannersService
      .getBanners({ name: search })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.data.set(this.mapBanners(response?.banners ?? []));
          this.totalItems.set(response?.count ?? 0);
          this.totalPages.set(response?.pages ?? 0);
        },
        error: (error) => {
          console.error('Erro ao carregar banners', error);
          this.toastr.error('Não foi possível carregar os banners.');
          this.errorMessage.set('Não foi possível carregar os banners.');
          this.data.set([]);
        },
      });
  }

  public onFilter(search: string): void {
    this.loadBanners(search);
  }

  private mapBanners(banners: AdminBannerDto[]): any[] {
    return banners.map((banner) => ({
      id: banner.id,
      initialDate: this.formatDate(banner.startDate),
      endDate: this.formatDate(banner.endDate),
      name: banner.title ?? '-',
      status: this.formatStatus(banner.status),
    }));
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

  private formatStatus(status?: string | null): string {
    if (!status) {
      return '-';
    }

    const normalized = status.toUpperCase();
    return normalized === 'ACTIVE' ? 'Ativo' : 'Desativado';
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
