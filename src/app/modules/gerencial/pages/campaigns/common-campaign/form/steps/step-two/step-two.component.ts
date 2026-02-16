import { CommonCampaignService, ShelfProduct, ShelfProductsResponse } from '../../../common-campaign.service';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';

export interface StepTwoData {
  date: string
  time: string
  productType: "cupom" | "produto" | "nenhum"
  couponCode: string
  configuration: string
  couponValue: string
  rescueValue: string
  usageLimit: string
  selectedProduct: string
  productNames: number[]
  productConfiguration: string
  productUsageLimit: string
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatChipsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss'
})
export class StepTwoComponent {
  private commonCampaignService = inject(CommonCampaignService)

  @Input() data: StepTwoData = {
    date: "",
    time: "",
    productType: "cupom",
    couponCode: "",
    configuration: "percentual",
    couponValue: "",
    rescueValue: "",
    usageLimit: "resgate-unico",
    selectedProduct: "",
    productNames: [],
    productConfiguration: "ao-cortar-o-cabelo",
    productUsageLimit: "resgate-unico",
  }
  @Output() dataChange = new EventEmitter<StepTwoData>()

  @ViewChild('productInput') productInput!: ElementRef<HTMLInputElement>

  form: FormGroup
  productCtrl = new FormControl<string | ShelfProduct | null>('')
  selectedProducts: ShelfProduct[] = []
  allProducts: ShelfProduct[] = []
  filteredProducts!: Observable<ShelfProduct[]>

  configurationOptions = [
    { value: "percentual", label: "Percentual" },
    { value: "valor-fixo", label: "Valor fixo" },
  ]

  usageLimitOptions = [
    { value: "resgate-unico", label: "Resgate único" },
    { value: "multiplos-resgates", label: "Múltiplos resgates" },
  ]

  productConfigurationOptions = [
    { value: "ao-cortar-o-cabelo", label: "Ao cortar o cabelo" },
    { value: "ao-fazer-barba", label: "Ao fazer barba" },
    { value: "ao-pintar-cabelo", label: "Ao pintar cabelo" },
  ]

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      date: [null, [Validators.required]],
      // enforce HH:MM pattern; use native time input in the template
      time: ["", [Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/)]],
      productType: ["cupom", [Validators.required]],
      // Cupom fields
      couponCode: [""],
      configuration: ["percentual"],
      couponValue: [""],
      rescueValue: [""],
      usageLimit: ["resgate-unico"],
      // Produto fields
      productConfiguration: ["ao-cortar-o-cabelo"],
      productUsageLimit: ["resgate-unico"],
    })
  }

  ngOnInit() {
    // Initialize form with input data
    this.form.patchValue({
      date: this.data.date,
      time: this.data.time,
      productType: this.data.productType,
      couponCode: this.data.couponCode,
      configuration: this.data.configuration,
      couponValue: this.data.couponValue,
      rescueValue: this.data.rescueValue,
      usageLimit: this.data.usageLimit,
      productConfiguration: this.data.productConfiguration,
      productUsageLimit: this.data.productUsageLimit,
    })

    // Load products from API
    this.loadProducts()

    // Setup filtered products
    this.filteredProducts = this.productCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : (value as ShelfProduct | null)?.name;
        return this._filterProducts(name || '');
      })
    )

    // Update validators based on product type
    this.updateValidators()

    // Listen to product type changes
    this.form.get("productType")?.valueChanges.subscribe(() => {
      this.updateValidators()
    })

    // Emit changes when form values change
    this.form.valueChanges.subscribe((value) => {
      this.emitFormData()
    })
  }

  private updateValidators() {
    const productType = this.form.get("productType")?.value
    const couponFields = ["couponCode", "configuration", "couponValue", "rescueValue"]
    const productFields = ["productConfiguration", "productUsageLimit"]

    if (productType === "cupom") {
      // Add validators for coupon fields
      couponFields.forEach((field) => {
        this.form.get(field)?.setValidators([Validators.required])
        this.form.get(field)?.updateValueAndValidity()
      })
      // Remove validators for product fields
      productFields.forEach((field) => {
        this.form.get(field)?.clearValidators()
        this.form.get(field)?.updateValueAndValidity()
      })
      // Remove validator for usageLimit
      this.form.get("usageLimit")?.clearValidators()
      this.form.get("usageLimit")?.updateValueAndValidity()
    } else if (productType === "produto") {
      // Remove validators for product fields
      productFields.forEach((field) => {
        this.form.get(field)?.clearValidators()
        this.form.get(field)?.updateValueAndValidity()
      })
      // Remove validators for coupon fields
      couponFields.forEach((field) => {
        this.form.get(field)?.clearValidators()
        this.form.get(field)?.updateValueAndValidity()
      })
      this.form.get("usageLimit")?.clearValidators()
      this.form.get("usageLimit")?.updateValueAndValidity()
    } else {
      // Remove validators for all fields
      const allFields = [...couponFields, ...productFields, "usageLimit"];
      allFields.forEach((field) => {
        this.form.get(field)?.clearValidators()
        this.form.get(field)?.updateValueAndValidity()
      })
    }
  }

  private emitFormData() {
    const formValue = this.form.value
    this.dataChange.emit({
      ...formValue,
      productNames: this.selectedProducts.map(p => p.id),
    })
  }

  get showCouponFields(): boolean {
    return this.form.get("productType")?.value === "cupom"
  }

  get showProductFields(): boolean {
    return this.form.get("productType")?.value === "produto"
  }

  loadProducts() {
    this.commonCampaignService.getShelfProducts({ status: 'ACTIVE' }).subscribe({
      next: (response: ShelfProductsResponse) => {
        this.allProducts = response.shelfs || []
        
        // Force filter to run once products are loaded
        const currentVal = this.productCtrl.value;
        this.productCtrl.setValue(currentVal, { emitEvent: true });
        
        // Load previously selected products if any
        if (this.data.productNames && this.data.productNames.length > 0) {
          this.selectedProducts = this.allProducts.filter(p => 
            this.data.productNames.includes(p.id)
          )
          this.emitFormData() // Ensure form state is updated with selected products
        }
      },
      error: (error: any) => {
        console.error('Erro ao carregar produtos:', error)
      }
    })
  }

  private _filterProducts(value: string): ShelfProduct[] {
    const filterValue = value.toLowerCase()
    return this.allProducts.filter(product => 
      !this.selectedProducts.some(p => p.id === product.id) &&
      product.name.toLowerCase().includes(filterValue)
    )
  }

  selectProduct(event: MatAutocompleteSelectedEvent): void {
    const product = event.option.value as ShelfProduct
    if (!this.selectedProducts.some(p => p.id === product.id)) {
      this.selectedProducts.push(product)
      this.emitFormData()
    }
    this.productInput.nativeElement.value = ''
    this.productCtrl.setValue('')
  }

  displayProduct(product: ShelfProduct | string | null): string {
    if (!product) return ''
    return typeof product === 'string' ? product : product.name
  }

  removeProduct(product: ShelfProduct): void {
    const index = this.selectedProducts.indexOf(product)
    if (index >= 0) {
      this.selectedProducts.splice(index, 1)
      this.emitFormData()
    }
  }

  // Allow only digits and colon for time input and enforce max length HH:MM
  onTimeKeyPress(event: KeyboardEvent): void {
    const key = event.key;

    // allow control keys (Backspace, Tab, Arrow keys, etc.)
    if (key.length > 1) return;

    // only allow digits and colon
    if (!/[0-9:]/.test(key)) {
      event.preventDefault();
      return;
    }

    const control = this.form.get('time');
    const currentValue: string = control?.value || '';

    // If selection covers text, allow replacement; otherwise block when length >= 5
    const target = event.target as HTMLInputElement | null;
    const selectionLength = target ? (target.selectionEnd ?? 0) - (target.selectionStart ?? 0) : 0;

    if (currentValue.length - selectionLength >= 5) {
      event.preventDefault();
    }
  }

  get isFormValid(): boolean {
    if (this.form.get('productType')?.value === 'produto') {
      return this.form.valid && this.selectedProducts.length > 0
    }
    return this.form.valid
  }

  /** mark all inner controls as touched so validation UI appears */
  public markAsTouched(): void {
    this.form.markAllAsTouched();
  }
}
