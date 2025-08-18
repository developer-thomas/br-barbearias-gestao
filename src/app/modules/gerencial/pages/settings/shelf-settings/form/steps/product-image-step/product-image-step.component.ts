import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ProductImageData {
  imageUrl: string | null | any;
}

@Component({
  selector: 'app-product-image-step',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './product-image-step.component.html',
  styleUrl: './product-image-step.component.scss'
})
export class ProductImageStepComponent {
  @Input() data: ProductImageData = {
    imageUrl: null,
  }
  @Output() dataChange = new EventEmitter<ProductImageData>()

  form: FormGroup

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      imageUrl: [null],
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
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        this.form.patchValue({ imageUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click()
  }

  removeImage() {
    this.form.patchValue({ imageUrl: null })
    // Also reset the file input value to allow re-uploading the same file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }
}
