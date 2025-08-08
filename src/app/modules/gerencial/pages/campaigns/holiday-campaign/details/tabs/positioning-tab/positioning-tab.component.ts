import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatRadioGroup, MatRadioModule } from '@angular/material/radio';

export interface StepFiveData {
  selectedChannel: 'sms' | 'email' | 'whatsapp'
}

type ActivePreview = "sms" | "email" | "whatsapp"

@Component({
  selector: 'app-positioning-tab',
  standalone: true,
  imports: [
    MatRadioGroup,
    CommonModule, 
    MatIcon,
    MatRadioModule,
    ReactiveFormsModule
  ],
  templateUrl: './positioning-tab.component.html',
  styleUrl: './positioning-tab.component.scss'
})
export class PositioningTabComponent implements OnInit {
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
