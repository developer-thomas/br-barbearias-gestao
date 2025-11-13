import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';

export interface BannerImageData {
  previewUrl: string | null;
  file: File | null;
}

@Component({
  selector: 'app-banner-image-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './banner-image-step.component.html',
  styleUrl: './banner-image-step.component.scss'
})
export class BannerImageStepComponent {
  @Input() data: BannerImageData = {
    previewUrl: null,
    file: null,
  }
  @Output() dataChange = new EventEmitter<BannerImageData>()

  form: FormGroup
  private selectedFile: File | null = null

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      previewUrl: [null],
    })
  }

  ngOnInit() {
    // Initialize form with input data
    this.selectedFile = this.data.file ?? null
    this.form.patchValue({ previewUrl: this.data.previewUrl ?? null })

    // Emit changes when form values change
    this.form.valueChanges.subscribe((value) => {
      this.emitData()
    })

    this.emitData()
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      this.selectedFile = file
      const reader = new FileReader()
      reader.onload = () => {
        this.form.patchValue({ previewUrl: reader.result as string })
        this.emitData()
      }
      reader.readAsDataURL(file)
    }
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click()
  }

  removeImage() {
    this.selectedFile = null
    this.form.patchValue({ previewUrl: null })
    // Also reset the file input value to allow re-uploading the same file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
    this.emitData()
  }

  private emitData(): void {
    const previewUrl = this.form.get('previewUrl')?.value ?? null
    this.dataChange.emit({
      previewUrl,
      file: this.selectedFile,
    })
  }
}
