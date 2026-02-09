import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface StepOneData {
  title: string
  description: string
}

@Component({
  selector: 'app-step-one',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.scss'
})
export class StepOneComponent {
  @Input() data: StepOneData = { title: "", description: "" }
  @Output() dataChange = new EventEmitter<StepOneData>()

  form: FormGroup

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ["", [Validators.required]],
    })
  }

  get isFormValid(): boolean {
    return this.form.valid
  }

  ngOnInit() {
    // Initialize form with input data
    this.form.patchValue(this.data)

    // Emit changes when form values change
    this.form.valueChanges.subscribe((value) => {
      this.dataChange.emit(value)
    })
  }
}
