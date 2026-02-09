import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FranchiseeItem, FranchiseeRegionsResponse, FranchiseeService } from '../../../../../../../../core/services/franchisee.service';
import { Observable, map, startWith } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
  locationNames: number[]
}

interface RegionDisplay extends FranchiseeItem {
  state: string
  city: string
  fullName: string
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
    MatAutocompleteModule,
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

  private franchiseeService = inject(FranchiseeService)

  form: FormGroup
  locationNames: number[] = []
  selectedRegions: RegionDisplay[] = []
  allRegions: RegionDisplay[] = []
  filteredRegions$!: Observable<RegionDisplay[]>

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

    // Load regions from API
    this.loadRegions()

    // Setup autocomplete filter
    this.filteredRegions$ = this.form.get('selectedLocation')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterRegions(value || ''))
    )

    // Emit changes when form values change
    this.form.valueChanges.subscribe((value) => {
      this.emitFormData()
    })
  }

  private loadRegions() {
    this.franchiseeService.getRegions().subscribe({
      next: (regionsResponse: FranchiseeRegionsResponse) => {
        this.allRegions = []
        Object.entries(regionsResponse).forEach(([state, cities]) => {
          Object.entries(cities).forEach(([city, items]) => {
            items.forEach(item => {
              this.allRegions.push({
                ...item,
                state,
                city,
                fullName: `${state}, ${city}, ${item.name}`
              })
            })
          })
        })
      },
      error: (error) => {
        console.error('Erro ao carregar regiões:', error)
      }
    })
  }

  private _filterRegions(value: string): RegionDisplay[] {
    const filterValue = (value?.toString() || '').toLowerCase();
    return this.allRegions.filter(region =>
      region.fullName.toLowerCase().includes(filterValue) ||
      region.name.toLowerCase().includes(filterValue) ||
      region.city.toLowerCase().includes(filterValue) ||
      region.state.toLowerCase().includes(filterValue)
    )
  }

  private emitFormData() {
    const formValue = this.form.value
    this.dataChange.emit({
      ...formValue,
      locationNames: this.locationNames,
    })
  }

  onRegionSelected(region: RegionDisplay) {
    if (region && !this.locationNames.includes(region.id)) {
      this.locationNames.push(region.id)
      this.selectedRegions.push(region)
      this.form.get("selectedLocation")?.setValue("")
      this.emitFormData()
    }
  }

  removeLocationName(index: number) {
    this.locationNames.splice(index, 1)
    this.selectedRegions.splice(index, 1)
    this.emitFormData()
  }

  onLocationSearch() {
    const searchValue = this.form.get("selectedLocation")?.value
    if (typeof searchValue === 'object' && searchValue !== null) {
      this.onRegionSelected(searchValue)
    }
  }

  displayRegionFn(region: RegionDisplay): string {
    return region && region.fullName ? region.fullName : ''
  }
}
