import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export interface StepOneData {
  name: string;
  timeToSend: string;
  settings: string;
  introduction: string;
}

@Component({
  selector: 'app-step-one',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.scss'
})
export class StepOneComponent {
  @Input() data!: StepOneData;
  @Output() dataChange = new EventEmitter<StepOneData>()

  form: FormGroup

  timeToSendOptions = [
    { title: "20 min", value: 20},
    { title: "30 min", value: 20},
    { title: "40 min", value: 20}
  ]

  settingsOptions = [
    { title: "Perguntas randômicas", value: "random-questions" }
  ]

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      timeToSend: ["", [Validators.required]],
      settings: ["", Validators.required],
      introduction: ["", [Validators.required]],
    }) 
  }

  ngOnInit() {
    // Emit changes when form values change
    this.form.valueChanges.subscribe((value) => {
      this.dataChange.emit(value)
    })
  }
}
