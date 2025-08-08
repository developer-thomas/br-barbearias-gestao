import { CommonModule } from "@angular/common"
import { Component, Input, Output, EventEmitter } from "@angular/core"
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"


export interface Client {
  name: string
  cpf: string
}

export interface Step1Data {
  campaignName: string
  targetAudience: string
  specificAudience: string
  selectedClient: string
  clients: Client[]
  description: string
}

@Component({
  selector: 'app-step-one',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.scss'
})
export class StepOneComponent {
  @Input() data!: Step1Data
  @Output() dataChange = new EventEmitter<Step1Data>()

  form: FormGroup
  clients: Client[] = []

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      campaignName: ["", Validators.required],
      targetAudience: ["cliente", Validators.required],
      specificAudience: ["cliente-especifico", Validators.required],
      selectedClient: [""],
      description: ["", Validators.required],
    })
  }

  ngOnInit() {
    this.form.patchValue(this.data)
    this.clients = [...this.data.clients]

    this.form.valueChanges.subscribe((value) => {
      this.emitFormData()
    })
  }

  private emitFormData() {
    this.dataChange.emit({
      ...this.form.value,
      clients: this.clients,
    })
  }

  addClient() {
    const clientName = this.form.get("selectedClient")?.value
    if (clientName && clientName.trim()) {
      // In a real app, you'd get the CPF from the selected client object
      const newClient: Client = { name: clientName, cpf: "000.000.00-00" }
      this.clients.push(newClient)
      this.form.get("selectedClient")?.setValue("")
      this.emitFormData()
    }
  }

  removeClient(index: number) {
    this.clients.splice(index, 1)
    this.emitFormData()
  }

  onClientSelected(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault()
      this.addClient()
    }
  }
}
