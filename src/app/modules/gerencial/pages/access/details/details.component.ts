import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { AccessDetailDto, AccessService, AccessStatus } from '../access.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

export interface AccessModule {
  id: string
  name: string
  enabled: boolean
}

export interface UserDetails {
  id: number
  name: string
  cpf: string
  email: string
  profileImage: string
  accessType: string
  isActive: boolean
  modules: AccessModule[]
  permissions: string[]
}

const PERMISSION_LABELS: Record<string, string> = {
  DASHBOARD: 'Dashboard',
  CLIENTS: 'Clientes',
  CAMPAIGNS: 'Campanhas',
  REPORTS: 'Relatórios',
  SETTINGS: 'Configurações',
  BANNERS: 'Banners',
  RANKS: 'Ranking',
  ACCESS: 'Acessos',
};

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    PageHeaderComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private accessService = inject(AccessService)
  private toastr = inject(ToastrService)

  private readonly defaultImage = 'assets/png/default-user.png';

  accessTypeOptions = [
    { value: "MASTER", label: "Master" },
    { value: "ADMIN", label: "Administrador" },
    { value: "MANAGER", label: "Gerente" },
    { value: "EMPLOYEE", label: "Funcionário" },
    { value: "VIEWER", label: "Visualizador" },
  ]

  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  user = signal<UserDetails | null>(null);
  isStatusUpdating = signal(false);

  constructor() {
    const userId = this.route.snapshot.paramMap.get("id")
    if (!userId) {
      this.errorMessage.set('Identificador do acesso não informado.');
      this.isLoading.set(false);
      return;
    }

    this.loadAccessDetail(userId);
  }

  private loadAccessDetail(id: string) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.accessService
      .getAccessDetail(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (detail) => this.user.set(this.mapDetailToUser(detail)),
        error: (error) => {
          console.error('Erro ao carregar detalhes do acesso', error);
          this.toastr.error('Não foi possível carregar os detalhes do acesso.');
          this.errorMessage.set('Não foi possível carregar os detalhes do acesso.');
        },
      });
  }

  private mapDetailToUser(detail: AccessDetailDto): UserDetails {
    const permissions = detail.permissions ?? [];
    return {
      id: detail.id,
      name: detail.name ?? '-',
      cpf: detail.document ?? '-',
      email: detail.email ?? '-',
      profileImage: detail.fileUrl || this.defaultImage,
      accessType: detail.role ?? '-',
      isActive: (detail.status ?? '').toUpperCase() === 'ACTIVE',
      modules: this.mapPermissionsToModules(permissions),
      permissions,
    };
  }

  private mapPermissionsToModules(permissions: string[] = []): AccessModule[] {
    const baseModules = Object.entries(PERMISSION_LABELS).map(([id, name]) => ({
      id,
      name,
      enabled: permissions.includes(id),
    }));

    const extraModules = permissions
      .filter((permission) => !(permission in PERMISSION_LABELS))
      .map((permission) => ({
        id: permission,
        name: permission,
        enabled: true,
      }));

    return [...baseModules, ...extraModules];
  }

  onEdit() {
    const detail = this.user();
    if (!detail) {
      return;
    }

    this.router.navigate(["/acessos/form", detail.id])
  }

  onToggleStatus(change: MatSlideToggleChange) {
    const detail = this.user();
    if (!detail) {
      return;
    }

    if (this.isStatusUpdating()) {
      change.source.checked = detail.isActive;
      return;
    }

    const previousState = detail.isActive;
    const nextState = change.checked;

    if (previousState === nextState) {
      return;
    }

    const nextStatus: AccessStatus = nextState ? 'ACTIVE' : 'INACTIVE';

    this.isStatusUpdating.set(true);
    this.user.set({ ...detail, isActive: nextState });

    this.accessService
      .updateAccessStatus(detail.id, nextStatus)
      .pipe(finalize(() => this.isStatusUpdating.set(false)))
      .subscribe({
        next: (response) => {
          const message = response?.message ?? this.buildStatusSuccessMessage(nextStatus);
          this.toastr.success(message);
        },
        error: (error) => {
          console.error('Erro ao atualizar status do acesso', error);
          this.user.set({ ...detail, isActive: previousState });
          this.toastr.error('Não foi possível alterar o status do administrador.');
        },
      });
  }

  private buildStatusSuccessMessage(status: AccessStatus): string {
    return status === 'ACTIVE'
      ? 'Status do administrador atualizado para ativo com sucesso.'
      : 'Status do administrador atualizado para inativo com sucesso.';
  }

  onAccessTypeChange(newAccessType: string) {
    const detail = this.user();
    if (!detail) {
      return;
    }

    const updated = { ...detail, accessType: newAccessType };
    this.user.set(updated);
    console.log("Tipo de acesso alterado:", newAccessType)
  }

  onModuleChange(moduleId: string, enabled: boolean) {
    const detail = this.user();
    if (!detail) {
      return;
    }

    const modules = detail.modules.map((module) =>
      module.id === moduleId ? { ...module, enabled } : module
    );

    this.user.set({ ...detail, modules });
    console.log(`Módulo ${moduleId} alterado:`, enabled)
  }
}
