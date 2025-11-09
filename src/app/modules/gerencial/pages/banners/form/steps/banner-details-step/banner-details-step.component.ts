import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';
import { BehaviorSubject, Observable, Subject, combineLatest, finalize, map, startWith, takeUntil } from 'rxjs';
import { BannersService, BannerRegionDto } from '../../../banners.service';
import { ToastrService } from 'ngx-toastr';

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
    NgxMaskDirective,
    MatAutocompleteModule
  ],
  templateUrl: './banner-details-step.component.html',
  styleUrl: './banner-details-step.component.scss'
})
export class BannerDetailsStepComponent implements OnInit, OnDestroy {
  @Input() data!: BannerDetailsData;

  @Output() dataChange = new EventEmitter<BannerDetailsData>()

  form: FormGroup
  locations: string[] = [];
  filteredRegions$!: Observable<string[]>;
  isLoadingRegions = false;

  private readonly bannersService = inject(BannersService);
  private readonly toastr = inject(ToastrService);
  private readonly destroy$ = new Subject<void>();
  private readonly regionsSubject = new BehaviorSubject<BannerRegionDto[]>([]);

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
    this.initializeFormData()
    this.setupFilteredRegionsStream()
    this.observeFormChanges()
    this.loadRegions()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private emitFormData() {
    const formValue = this.form.value
    this.dataChange.emit({
      ...formValue,
      locations: this.locations,
    })
  }

  addLocation(locationValue?: string) {
    const control = this.form.get("selectedLocation")
    const rawValue = locationValue ?? control?.value
    const normalizedValue = typeof rawValue === "string" ? rawValue.trim() : ""

    if (!normalizedValue) {
      return
    }

    const alreadyAdded = this.locations.some(
      (saved) => saved.toLocaleLowerCase() === normalizedValue.toLocaleLowerCase()
    )

    if (alreadyAdded) {
      control?.setValue("")
      return
    }

    this.locations.push(normalizedValue)
    control?.setValue("")
    this.emitFormData()
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

  onRegionOptionSelected(location: string) {
    this.addLocation(location)
  }

  private initializeFormData(): void {
    if (this.data) {
      this.form.patchValue({
        title: this.data.title ?? "",
        link: this.data.link ?? "",
        startDate: this.data.startDate ?? "",
        endDate: this.data.endDate ?? "",
        targetAudience: this.data.targetAudience ?? "filiais",
        selectedLocation: this.data.selectedLocation ?? "",
      }, { emitEvent: false })

      this.locations = Array.isArray(this.data.locations) ? [...this.data.locations] : []
    }
  }

  private setupFilteredRegionsStream(): void {
    const selectedLocationControl = this.form.get("selectedLocation")

    if (!selectedLocationControl) {
      return
    }

    this.filteredRegions$ = combineLatest([
      selectedLocationControl.valueChanges.pipe(
        startWith(selectedLocationControl.value ?? "")
      ),
      this.regionsSubject.asObservable(),
    ]).pipe(
      map(([search, regions]) => this.filterRegions(typeof search === "string" ? search : "", regions))
    )
  }

  private observeFormChanges(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.emitFormData())

    this.emitFormData()
  }

  private loadRegions(): void {
    this.isLoadingRegions = true

    this.bannersService
      .getRegions()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoadingRegions = false))
      )
      .subscribe({
        next: (regions: BannerRegionDto[]) => {
          this.regionsSubject.next(regions ?? [])
        },
        error: (error: unknown) => {
          console.error("Erro ao carregar regiões de banners", error)
          this.toastr.error("Não foi possível carregar as regiões de banners.")
        },
      })
  }

  private filterRegions(search: string, regions: BannerRegionDto[]): string[] {
    if (!search) {
      return regions.map((region) => this.formatRegion(region))
    }

    const normalizedSearch = search.toLocaleLowerCase()

    return regions
      .filter((region) =>
        this.formatRegion(region).toLocaleLowerCase().includes(normalizedSearch)
      )
      .map((region) => this.formatRegion(region))
  }

  private formatRegion(region: BannerRegionDto): string {
    return `${region.city} - ${region.state}`
  }
}
