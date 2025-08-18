import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';

export interface BannerDetailsData {
  title: string
  link: string
  startDate: string
  endDate: string
  targetAudience: string
  selectedLocation: string
  locations: string[]
}

@Component({
  selector: 'app-banner-details-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    NgxMaskDirective
  ],
  templateUrl: './banner-details-step.component.html',
  styleUrl: './banner-details-step.component.scss'
})
export class BannerDetailsStepComponent implements OnInit {
  @Input() data!: BannerDetailsData;

  @Output() dataChange = new EventEmitter<BannerDetailsData>()

  form: FormGroup
  locations: string[] = [];

  targetAudienceOptions = [
    { value: "filiais", label: "Filiais" },
    { value: "clientes", label: "Clientes" },
    { value: "todos", label: "Todos" },
  ]

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ["", [Validators.required]],
      link: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      targetAudience: ["filiais", [Validators.required]],
      selectedLocation: [""],
    })
  }

  ngOnInit() {
  }

  private emitFormData() {
    const formValue = this.form.value
    this.dataChange.emit({
      ...formValue,
      locations: this.locations,
    })
  }

  addLocation() {
    const locationValue = this.form.get("selectedLocation")?.value
    if (locationValue && locationValue.trim()) {
      this.locations.push(locationValue.trim())
      this.form.get("selectedLocation")?.setValue("")
      this.emitFormData()
    }
  }

  removeLocation(index: number) {
    this.locations.splice(index, 1)
    this.emitFormData()
  }

  onLocationSelected(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault()
      this.addLocation()
    }
  }
}
