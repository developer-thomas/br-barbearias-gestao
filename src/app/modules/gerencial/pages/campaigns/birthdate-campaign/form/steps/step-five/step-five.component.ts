import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioButton, MatRadioModule } from "@angular/material/radio";

export interface StepFiveData {
  selectedChannel: 'sms' | 'email' | 'whatsapp'
}

type ActivePreview = "sms" | "email" | "whatsapp"


@Component({
  selector: 'app-step-five',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatRadioModule
],
  templateUrl: './step-five.component.html',
  styleUrl: './step-five.component.scss'
})
export class StepFiveComponent implements OnInit {
  @Input() data: StepFiveData = {
    selectedChannel: 'sms',
  }
  
  @Output() dataChange = new EventEmitter<StepFiveData>()

  form: FormGroup = this.fb.group({
    selectedChannel: ['sms'],
  })

  activePreview: ActivePreview = "sms"

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selectedChannel: ['sms'],
    })
  }

  ngOnInit() {
  // Atualiza o valor inicial com os dados recebidos
  this.form.patchValue({ selectedChannel: this.data.selectedChannel })
  this.updateActivePreview()

  this.form.valueChanges.subscribe((value) => {
    this.dataChange.emit(value)
    this.updateActivePreview()
  })
}

updateActivePreview() {
  this.activePreview = this.form.value.selectedChannel
}

handleCheckboxChange(channel: ActivePreview) {
  this.activePreview = channel
}
}
