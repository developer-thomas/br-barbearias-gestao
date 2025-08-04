import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { UploadFileService } from '../../../../../shared/services/upload-file/upload-file.service';
import { ClientService } from '../../client.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    PageHeaderComponent,
    BaseButtonComponent,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.scss'
})
export class ClientEditComponent implements OnInit{
  private fb = inject(FormBuilder)
  private toastr = inject(ToastrService)
  private uploadfileService = inject(UploadFileService)
  private clientService = inject(ClientService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  public title = "Clientes"
  public pageSession = "Editar Cliente"
  public hide = true
  public loading = false
  public clientId: string | null = null

  public form = this.fb.group({
    name: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    document: ["", [Validators.required]],
    birthdate: ["", [Validators.required]],
    phone: ["", [Validators.required]],
    payment: ["", [Validators.required]],
    avatar: [""],
    canAccess: [false, [Validators.required]],
    password: [""],
    confirmPassword: [""],
    address: this.fb.group({
      zipCode: ["", [Validators.required]],
      street: ["", [Validators.required]],
      number: ["", [Validators.required]],
      district: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      complement: [""],
    }),
  })

  get avatar() {
    return this.form.controls.avatar.value
  }

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get("id")

    if (this.clientId) {
      this.loadClientData(this.clientId)
    } else {
      this.toastr.error("ID do cliente não encontrado")
      this.router.navigate(["/client"])
    }
  }

  loadClientData(id: string): void {
    this.loading = true
    this.clientService
      .getClientById(id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (client) => {
          // Preencher o formulário com os dados do cliente
          this.form.patchValue({
            name: client.name,
            email: client.email,
            document: client.document,
            birthdate: this.formatDateForInput(client.birthdate),
            phone: client.phone,
            payment: client.payment,
            avatar: client.avatar,
            canAccess: client.canAccess,
          })

          // Se o cliente tiver endereços, preencher o primeiro endereço
          if (client.addresses && client.addresses.length > 0) {
            const address = client.addresses[0]
            this.form.get("address")?.patchValue({
              zipCode: address.zipCode,
              street: address.street,
              number: address.number,
              district: address.district,
              city: address.city,
              state: address.state,
              complement: address.complement,
            })
          }
        },
        error: (error) => {
          console.error("Erro ao carregar dados do cliente:", error)
          this.toastr.error("Erro ao carregar dados do cliente")
        },
      })
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return ""

    // Converter a string de data para o formato YYYY-MM-DD para o input type="date"
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  uploadFile(event: any) {
    const file = event.target.files[0]
    if (!file) {
      return
    }

    this.loading = true
    this.uploadfileService
      .upload(file)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.form.controls.avatar.setValue(response.url)
        },
        error: (error) => {
          console.error("Erro ao fazer upload do arquivo:", error)
          this.toastr.error("Erro ao fazer upload do arquivo")
        },
      })
  }

  goBack() {
    this.router.navigate(["/admin/clients"])
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.toastr.warning("Por favor, preencha todos os campos obrigatórios")
      return
    }

    const { confirmPassword, ...data } = this.form.value

    if (data.canAccess && data.password !== confirmPassword) {
      this.toastr.error("As senhas não conferem")
      return
    }

    // Se a senha estiver vazia e canAccess for true, verificar se é necessário atualizar a senha
    if (data.canAccess && !data.password) {
      delete data.password
    }

    this.loading = true
    this.clientService
      .updateClient(this.clientId!, data)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.toastr.success("Cliente atualizado com sucesso")
        },
        error: (error) => {
          console.error("Erro ao atualizar cliente:", error)
          this.toastr.error("Erro ao atualizar cliente")
        },
      })
  }
}
