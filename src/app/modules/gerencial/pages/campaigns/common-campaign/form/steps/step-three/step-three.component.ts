import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export interface Step3Data {
  ageFrom: number
  ageTo: number
  gender: string
  selectedLocation: string
  locationNames: string[]
}

@Component({
  selector: 'app-step-three',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './step-three.component.html',
  styleUrl: './step-three.component.scss'
})
export class StepThreeComponent {
  @Input() data: Step3Data = {
    ageFrom: 20,
    ageTo: 50,
    gender: "homens-e-mulheres",
    selectedLocation: "",
    locationNames: [],
  }
  @Output() dataChange = new EventEmitter<Step3Data>()

  form: FormGroup
  locationNames: string[] = []

  ageOptions = Array.from({ length: 81 }, (_, i) => i + 18) // 18 to 98

  genderOptions = [
    { value: "homens-e-mulheres", label: "Homens e mulheres" },
    { value: "homens", label: "Homens" },
    { value: "mulheres", label: "Mulheres" },
  ]

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      ageFrom: [20, [Validators.required]],
      ageTo: [50, [Validators.required]],
      gender: ["homens-e-mulheres", [Validators.required]],
      selectedLocation: [""],
    })
  }

  ngOnInit() {
    // Initialize form with input data
    this.form.patchValue({
      ageFrom: this.data.ageFrom,
      ageTo: this.data.ageTo,
      gender: this.data.gender,
      selectedLocation: this.data.selectedLocation,
    })

    // Initialize location names
    this.locationNames = [...this.data.locationNames]

    // Emit changes when form values change
    this.form.valueChanges.subscribe((value) => {
      this.emitFormData()
    })
  }

  private emitFormData() {
    const formValue = this.form.value
    this.dataChange.emit({
      ...formValue,
      locationNames: this.locationNames,
    })
  }

  addLocationName(locationName: string) {
    if (locationName.trim()) {
      this.locationNames.push(locationName.trim())
      this.form.get("selectedLocation")?.setValue("")
      this.emitFormData()
    }
  }

  removeLocationName(index: number) {
    this.locationNames.splice(index, 1)
    this.emitFormData()
  }

  onLocationSearch() {
    const locationValue = this.form.get("selectedLocation")?.value
    if (locationValue) {
      this.addLocationName(locationValue)
    }
  }

  onLocationSelected(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault()
      const inputElement = event.target as HTMLInputElement
      this.addLocationName(inputElement.value)
    }
  }
}
