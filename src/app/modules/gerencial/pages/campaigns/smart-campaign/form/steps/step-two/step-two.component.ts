import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';

export interface StepTwoData {
  initialDate: string;
  validity: string;
  pointsType: string;
  pointsValue: string;
}

@Component({
  selector: 'app-step-two',
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
    MatCardModule,
    NgxMaskDirective
  ],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss'
})
export class StepTwoComponent {
  @Input() data!: StepTwoData;
  @Output() dataChange = new EventEmitter<StepTwoData>()

  pointsTypeOptions = [
    { title: "Quantitativa", value: 'quantitative' }
  ]

  form: FormGroup
  productNames: string[] = []

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      initialDate: ["", [Validators.required]],
      validity: ["", [Validators.required]],
      pointsType: ["", [Validators.required]],
      pointsValue: ["", [Validators.required]]
    })
  }

  ngOnInit() {
    // Emit changes when form values change
    this.form.valueChanges.subscribe((value) => {
      this.emitFormData()
    })
  }

  private emitFormData() {
    const formValue = this.form.value
    this.dataChange.emit({
      ...formValue,
    })
  }
}
