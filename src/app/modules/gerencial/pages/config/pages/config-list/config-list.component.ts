import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ConfigResponse, ConfigService } from '../../config.service';

@Component({
  selector: 'app-config-list',
  standalone: true,
  templateUrl: './config-list.component.html',
  styleUrl: './config-list.component.scss',
  imports: [
    FilterTableComponent,
    CommomTableComponent,
    RouterLink,
    PageHeaderComponent,
    BaseButtonComponent,
  ],
})
export class ConfigListComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private configService = inject(ConfigService);

  public title = 'Configurações';
  public pageSession = 'Configurações';
  public admins: ConfigResponse[] = [];

  public displayedColumns: TableColumn[] = [
    { label: 'ID', key: 'id', type: 'text' },
    { label: 'Nome', key: 'name', type: 'text' },
    { label: 'E-mail', key: 'email', type: 'text' },
    { label: 'Status', key: 'active', type: 'status' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit(): void {
    this.getAdmins();
  }

  private getAdmins(search?: string): void {
    this.configService.getAll(1, 10, search).subscribe((response) => {
      this.admins = response.data;
    });
  }

  public gotoFormPage(): void {
    this.router.navigate(['form'], { relativeTo: this.activatedRoute });
  }

  public gotoEdit(config: ConfigResponse) {
    this.router.navigate(['edit', config.id], { relativeTo: this.activatedRoute });
  }
}
