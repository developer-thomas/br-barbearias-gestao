import { Component, inject, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { CommomTableComponent, TableColumn } from "../../../../../shared/components/commom-table/commom-table.component";
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';
import { Router } from '@angular/router';
import { ShelfSettingsService, ShelfDto } from '../shelf-settings.service';
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
  private readonly router = inject(Router);
  private readonly shelfSettingsService = inject(ShelfSettingsService);
  private readonly toastr = inject(ToastrService);
  public data = signal<any[]>([]);
  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);
  public totalItems = signal<number>(0);
  public totalPages = signal<number>(0);

  public displayedColumns: TableColumn[] = [
    { label: 'COD', key: 'id', type: 'text' },
    { label: 'Produto', key: 'product', type: 'text' },
    { label: 'Pontuação resgate', key: 'pointsRescue', type: 'text' },
    { label: 'Vencimento', key: 'validity', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  constructor() {
    this.loadShelves();
  }

  private loadShelves(search?: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.shelfSettingsService
      .getShelves({ name: search })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.data.set(this.mapShelves(response?.shelfs ?? []));
          this.totalItems.set(response?.count ?? 0);
          this.totalPages.set(response?.pages ?? 0);
        },
        error: (error) => {
          console.error('Erro ao carregar prateleiras', error);
          this.toastr.error('Não foi possível carregar as prateleiras.');
          this.errorMessage.set('Não foi possível carregar as prateleiras.');
          this.data.set([]);
        },
      });
  }

  public onFilter(search: string): void {
    this.loadShelves(search);
  }

  private mapShelves(shelves: ShelfDto[]): any[] {
    return shelves.map((shelf) => ({
      id: shelf.id,
      product: shelf.name ?? '-',
      pointsRescue: this.formatPoints(shelf.points),
      validity: this.formatDate(shelf.expirateAt),
      status: this.formatStatus(shelf.status),
    }));
  }

  private formatPoints(points?: number | null): string {
    if (points === null || points === undefined) {
      return '-';
    }

    return new Intl.NumberFormat('pt-BR').format(points);
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
    return normalized === 'ACTIVE' ? 'Ativo' : 'Inativo';
  }

  gotoEditPage(row: any) {}

  gotoDetailPage(row: any) {
    this.router.navigate([`gerencial/configuracao/prateleira/${row.id}`])
  }

  deleteRow(row: any) {}

  

}
