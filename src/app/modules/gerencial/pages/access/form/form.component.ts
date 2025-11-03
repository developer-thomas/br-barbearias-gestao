import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { NgxMaskDirective } from 'ngx-mask';
import { AccessDetailDto, AccessRole, AccessService, CreateAccessRequest, UpdateAccessRequest } from '../access.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

export interface AccessModule {
  id: string
  name: string
  enabled: boolean
}

const PERMISSION_OPTIONS: AccessModule[] = [
  { id: 'DASHBOARD', name: 'Dashboard', enabled: false },
  { id: 'CLIENTS', name: 'Clientes', enabled: false },
  { id: 'CAMPAIGNS', name: 'Campanhas', enabled: false },
  { id: 'REPORTS', name: 'Relatórios', enabled: false },
  { id: 'SETTINGS', name: 'Configurações', enabled: false },
  { id: 'BANNERS', name: 'Banners', enabled: false },
  { id: 'RANKS', name: 'Ranking', enabled: false },
  { id: 'ACCESS', name: 'Acessos', enabled: false },
];

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
  private accessService = inject(AccessService)
  private toastr = inject(ToastrService)
  private route = inject(ActivatedRoute)

  form: FormGroup
  showPassword = false
  isSubmitting = false
  isLoadingDetail = false
  selectedFile: File | null = null
  userId: string | null = null
  isEditMode = false

  accessTypeOptions = [
    { value: "MASTER" as AccessRole, label: "Master" },
    { value: "ADMIN" as AccessRole, label: "Administrador" },
    { value: "MANAGER" as AccessRole, label: "Gerente" },
    { value: "EMPLOYEE" as AccessRole, label: "Funcionário" },
    { value: "VIEWER" as AccessRole, label: "Visualizador" },
  ]

  modules: AccessModule[] = PERMISSION_OPTIONS.map((module) => ({ ...module }))

  constructor() {
    this.form = this.fb.group({
      fullName: ["", [Validators.required]],
      cpf: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      accessType: ["ADMIN", [Validators.required]],
      profileImage: [null],
    })

    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;

    if (this.isEditMode && this.userId) {
      this.disablePersonalFields();
      this.loadAccessDetail(this.userId);
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  onCancel() {
    this.router.navigate(["/acessos"])
  }

  onSubmit() {
    if (this.isLoadingDetail) {
      return;
    }

    if (this.form.valid) {
      if (!this.isEditMode && !this.selectedFile) {
        this.toastr.warning('Adicione uma foto do administrador.');
        return;
      }

      const permissions = this.getSelectedPermissions();

      if (permissions.length === 0) {
        this.toastr.warning('Selecione ao menos uma permissão.');
        return;
      }

      this.isSubmitting = true;

      if (this.isEditMode && this.userId) {
        const updatePayload = this.buildUpdateAccessPayload(permissions);

        this.accessService
          .updateAccess(this.userId, updatePayload)
          .pipe(finalize(() => (this.isSubmitting = false)))
          .subscribe({
            next: (response) => {
              const message = response?.message ?? 'Administrador atualizado com sucesso.';
              this.toastr.success(message);
              this.router.navigate(["/acessos"]);
            },
            error: (error) => {
              console.error('Erro ao atualizar administrador', error);
              this.toastr.error('Não foi possível atualizar o administrador.');
            },
          });
      } else {
        const createPayload = this.buildCreateAccessPayload(permissions);

        this.accessService
          .createAccess(createPayload)
          .pipe(finalize(() => (this.isSubmitting = false)))
          .subscribe({
            next: (response) => {
              const message = response?.message ?? 'Administrador criado com sucesso.';
              this.toastr.success(message);
              this.router.navigate(["/acessos"]);
            },
            error: (error) => {
              console.error('Erro ao criar administrador', error);
              this.toastr.error('Não foi possível criar o administrador.');
            },
          });
      }
      return;
    }

    this.toastr.error('Formulário inválido. Verifique os campos obrigatórios.');
    this.markFormGroupTouched()
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
    if (this.isEditMode || this.isLoadingDetail) {
      return;
    }

    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      this.selectedFile = file
      const reader = new FileReader()
      reader.onload = () => {
        this.form.patchValue({ profileImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    if (this.isEditMode || this.isLoadingDetail) {
      return;
    }
    fileInput.click()
  }

  removeImage() {
    if (this.isEditMode || this.isLoadingDetail) {
      return;
    }
    this.form.patchValue({ profileImage: null })
    this.selectedFile = null
  }

  onModuleChange(moduleId: string, enabled: boolean) {
    this.modules = this.modules.map((module) =>
      module.id === moduleId ? { ...module, enabled } : module
    )
  }

  private loadAccessDetail(id: string) {
    this.isLoadingDetail = true;

    this.accessService
      .getAccessDetail(id)
      .pipe(finalize(() => (this.isLoadingDetail = false)))
      .subscribe({
        next: (detail) => this.populateForm(detail),
        error: (error) => {
          console.error('Erro ao carregar dados do administrador', error);
          this.toastr.error('Não foi possível carregar as informações do administrador.');
          this.router.navigate(["/acessos"]);
        },
      });
  }

  private populateForm(detail: AccessDetailDto) {
    this.form.patchValue({
      fullName: detail.name ?? '',
      cpf: detail.document ?? '',
      email: detail.email ?? '',
      accessType: (detail.role ?? 'ADMIN') as AccessRole,
      profileImage: detail.fileUrl ?? null,
    });

    this.modules = PERMISSION_OPTIONS.map((module) => ({
      ...module,
      enabled: detail.permissions?.includes(module.id) ?? false,
    }));
  }

  private getSelectedPermissions(): string[] {
    return this.modules.filter((module) => module.enabled).map((module) => module.id)
  }

  private sanitizeDocument(document: string): string {
    return document.replace(/\D/g, '')
  }

  private buildCreateAccessPayload(permissions: string[]): CreateAccessRequest {
    const { fullName, cpf, email, password, accessType } = this.form.value

    return {
      name: (fullName ?? '').trim(),
      email: (email ?? '').trim(),
      document: this.sanitizeDocument(cpf ?? ''),
      password: password ?? '',
      role: (accessType ?? 'ADMIN') as AccessRole,
      permissions,
      file: this.selectedFile!,
    }
  }

  private buildUpdateAccessPayload(permissions: string[]): UpdateAccessRequest {
    const { accessType } = this.form.value;

    return {
      role: (accessType ?? 'ADMIN') as AccessRole,
      permissions,
    };
  }

  private disablePersonalFields() {
    ['fullName', 'cpf', 'email', 'password', 'profileImage'].forEach((control) => {
      this.form.get(control)?.disable();
    });
  }
}
