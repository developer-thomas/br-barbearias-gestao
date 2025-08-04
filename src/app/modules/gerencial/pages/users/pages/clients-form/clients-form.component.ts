import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { UploadFileService } from '../../../../../shared/services/upload-file/upload-file.service';
import { ClientService } from '../../client.service';

@Component({
  selector: 'app-clients-form',
  standalone: true,
  templateUrl: './clients-form.component.html',
  styleUrl: './clients-form.component.scss',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    NgxMaskDirective,
    PageHeaderComponent,
    BaseButtonComponent,
  ],
})
export class ClientsFormComponent {
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private toastr = inject(ToastrService);
  private uploadfileService = inject(UploadFileService);
  private clientService = inject(ClientService);

  public title = 'Clientes';
  public pageSession = 'Novo Cliente';
  public hide = true;

  public form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    document: ['', [Validators.required]],
    birthdate: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    payment: ['', [Validators.required]],
    avatar: [''],
    canAccess: ['', [Validators.required]],
    password: [''],
    confirmPassword: [''],
    address: this.fb.group({
      zipcode: ['', [Validators.required]],
      street: ['', [Validators.required]],
      number: ['', [Validators.required]],
      district: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
    }),
  });

  get avatar() {
    return this.form.controls.avatar.value;
  }

  uploadFile(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    this.uploadfileService.upload(file).subscribe((response) => {
      this.form.controls.avatar.setValue(response.url);
    });
  }

  goBack() {
    this.location.back();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { confirmPassword, ...data } = this.form.value;

    if (data.canAccess && data.password !== confirmPassword) {
      this.toastr.error('As senhas não conferem');
      return;
    }

    this.clientService.save(data).subscribe(() => {
      this.toastr.success('Cliente cadastrado com sucesso');
      this.goBack();
    });
  }
}
