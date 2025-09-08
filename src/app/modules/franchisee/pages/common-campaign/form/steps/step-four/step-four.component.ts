import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface Step4Data {
  imageUrl: string | null
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
