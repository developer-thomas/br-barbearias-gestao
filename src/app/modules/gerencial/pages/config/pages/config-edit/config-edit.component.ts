import { Location } from '@angular/common';
import { Component, inject, Input, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMaskDirective } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ConfigPermissionResponse, ConfigService } from '../../config.service';

@Component({
  selector: 'app-config-edit',
  standalone: true,
  templateUrl: './config-edit.component.html',
  styleUrl: './config-edit.component.scss',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    NgxMaskDirective,
    PageHeaderComponent,
    BaseButtonComponent,
  ],
})
export class ConfigEditComponent implements OnInit {
  private location = inject(Location);
  private configService = inject(ConfigService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  @Input() id!: string;
  @ViewChildren('permission') checkboxes!: MatCheckbox[];

  public title = 'Configurações';
  public pageSession = 'Novo Colaborador';
  public status!: boolean;
  public permissions: ConfigPermissionResponse[] = [];

  public form = this.fb.group({
    name: ['', [Validators.required]],
    cpf: ['', [Validators.required]],
    email: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.getPermissions();
  }

  private getPermissions(): void {
    this.configService.getPermissions().subscribe((response) => {
      this.permissions = response.map((p) => ({ ...p, checked: false }));
      this.getAdmin();
    });
  }

  private getAdmin(): void {
    this.configService.getById(this.id).subscribe((response) => {
      this.form.patchValue(response);
      this.permissions.forEach((p) => {
        p.checked = response.permissions.includes(p.id);
      });
      this.status = response.active;
    });
  }

  public changeStatus(): void {
    this.configService.updateStatus(this.id).subscribe(() => {
      this.toastr.success('Status alterado com sucesso!');
      this.goBack();
    });
  }

  public goBack(): void {
    this.location.back();
  }

  public submit(): void {
    const permissions = this.checkboxes.filter((c) => c.checked).map((c) => c.value);

    if (this.form.invalid || !permissions.length) {
      this.toastr.error('Preencha todos os campos obrigatórios!');
      return;
    }

    const data = { ...this.form.value, permissions };

    this.configService.save(data).subscribe(() => {
      this.toastr.success('Colaborador cadastrado com sucesso!');
      this.goBack();
    });
  }
}
