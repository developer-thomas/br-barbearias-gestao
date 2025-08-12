import { CommonModule } from "@angular/common"
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core"
import { ReactiveFormsModule, FormGroup, FormBuilder } from "@angular/forms"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatIconModule } from "@angular/material/icon"
import { MatRadioModule } from "@angular/material/radio"


export interface StepFiveData {
  selectedChannel: 'sms' | 'email' | 'whatsapp'
}

type ActivePreview = "sms" | "email" | "whatsapp"

@Component({
  selector: 'app-step-six',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatRadioModule
  ],
  templateUrl: './step-six.component.html',
  styleUrl: './step-six.component.scss'
})
export class StepSixComponent implements OnInit {
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
