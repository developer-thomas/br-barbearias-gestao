import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { NgxMaskDirective } from 'ngx-mask';

export interface AccessModule {
  id: string
  name: string
  enabled: boolean
}

export interface AccessFormData {
  fullName: string
  cpf: string
  email: string
  password: string
  accessType: string
  profileImage: string | null
  modules: AccessModule[]
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    PageHeaderComponent,
    NgxMaskDirective
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  private router = inject(Router)
  private fb: FormBuilder = inject(FormBuilder)

  form: FormGroup
  showPassword = false

  accessTypeOptions = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Gerente" },
    { value: "employee", label: "Funcionário" },
    { value: "viewer", label: "Visualizador" },
  ]

  modules: AccessModule[] = [
    { id: "dashboard", name: "Módulo", enabled: false },
    { id: "campaigns", name: "Módulo", enabled: false },
    { id: "clients", name: "Módulo", enabled: false },
    { id: "reports", name: "Módulo", enabled: true },
    { id: "settings", name: "Módulo", enabled: true },
    { id: "banners", name: "Módulo", enabled: false },
  ]

  constructor() {
    this.form = this.fb.group({
      fullName: ["", [Validators.required]],
      cpf: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      accessType: ["admin", [Validators.required]],
      profileImage: [null],
    })
  }

  onCancel() {
    this.router.navigate(["/acessos"])
  }

  onContinue() {
    if (this.form.valid) {
      const formData: AccessFormData = {
        ...this.form.value,
        modules: this.modules,
      }
      console.log("Dados do usuário:", formData)
      // Here you would typically send the data to a server
      this.router.navigate(["/acessos"])
    } else {
      console.log("Formulário inválido")
      this.markFormGroupTouched()
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key)
      control?.markAsTouched()
    })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        this.form.patchValue({ profileImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click()
  }

  removeImage() {
    this.form.patchValue({ profileImage: null })
  }

  onModuleChange(moduleId: string, enabled: boolean) {
    const moduleIndex = this.modules.findIndex((m) => m.id === moduleId)
    if (moduleIndex !== -1) {
      this.modules[moduleIndex].enabled = enabled
    }
  }
}
