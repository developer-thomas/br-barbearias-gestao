import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FileResponse, UploadService } from '../../../../../../../../core/services/upload.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';

export interface Step4Data {
  imageUrl: string | null
  imageKey?: string | null
}

interface UploadFileResponse {
  fileUrl: string
  fileKey: string | null
}

@Component({
  selector: 'app-step-four',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule
  ],
  templateUrl: './step-four.component.html',
  styleUrl: './step-four.component.scss'
})
export class StepFourComponent {
  @Input() data: Step4Data = {
    imageUrl: null,
  }
  @Output() dataChange = new EventEmitter<Step4Data>()

  form!: FormGroup

  private uploadService = inject(UploadService)
  private toastr = inject(ToastrService)

  @Input() uploading = false

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      imageUrl: [null],
      imageKey: [null],
    })
  }

  ngOnInit() {
    // Initialize form with input data
    this.form.patchValue(this.data)

    // Emit changes when form values change
    this.form.valueChanges.subscribe((value) => {
      this.dataChange.emit(value)
    })
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    this.uploadService.uploadFile(file).subscribe({
      next: (resp: FileResponse) => {
        if (!this.isUploadFileResponse(resp)) {
          this.toastr.error('Resposta inválida do upload', 'Upload')
          return
        }
        this.form.patchValue({ imageUrl: resp.fileUrl, imageKey: resp.fileKey })
        this.toastr.success('Imagem enviada com sucesso', 'Upload')
      },
      error: (err) => {
        console.error('Upload error', err)
        this.toastr.error('Erro ao enviar a imagem', 'Upload')
      }
    })
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click()
  }

  removeImage() {
    this.form.patchValue({ imageUrl: null, imageKey: null })
    // Also reset the file input value to allow re-uploading the same file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  private isUploadFileResponse(value: unknown): value is UploadFileResponse {
    return typeof value === 'object' &&
      value !== null &&
      'fileUrl' in value &&
      typeof (value as { fileUrl: unknown }).fileUrl === 'string' &&
      'fileKey' in value
  }
}
