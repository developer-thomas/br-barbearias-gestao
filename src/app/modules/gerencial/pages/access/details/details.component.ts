import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

export interface AccessModule {
  id: string
  name: string
  enabled: boolean
}

export interface UserDetails {
  id: string
  name: string
  cpf: string
  email: string
  profileImage: string
  accessType: string
  isActive: boolean
  modules: AccessModule[]
}

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

  accessTypeOptions = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Gerente" },
    { value: "employee", label: "Funcionário" },
    { value: "viewer", label: "Visualizador" },
  ]

  user: UserDetails = {
    id: "1",
    name: "Marina Silva",
    cpf: "000000000-00",
    email: "mail@email.com",
    profileImage: "assets/png/default-user.png",
    accessType: "admin",
    isActive: true,
    modules: [
      { id: "dashboard", name: "Módulo", enabled: false },
      { id: "campaigns", name: "Módulo", enabled: false },
      { id: "clients", name: "Módulo", enabled: false },
      { id: "reports", name: "Módulo", enabled: true },
      { id: "settings", name: "Módulo", enabled: true },
      { id: "banners", name: "Módulo", enabled: false },
    ],
  }

  constructor() {
    const userId = this.route.snapshot.paramMap.get("id")
    console.log("User ID:", userId)
  }

  onEdit() {
    this.router.navigate(["/acessos/form", this.user.id])
  }

  onToggleStatus() {
    this.user.isActive = !this.user.isActive
    console.log("Status do usuário alterado:", this.user.isActive)
  }

  onAccessTypeChange(newAccessType: string) {
    this.user.accessType = newAccessType
    console.log("Tipo de acesso alterado:", newAccessType)
  }

  onModuleChange(moduleId: string, enabled: boolean) {
    const moduleIndex = this.user.modules.findIndex((m) => m.id === moduleId)
    if (moduleIndex !== -1) {
      this.user.modules[moduleIndex].enabled = enabled
      console.log(`Módulo ${moduleId} alterado:`, enabled)
    }
  }
}
