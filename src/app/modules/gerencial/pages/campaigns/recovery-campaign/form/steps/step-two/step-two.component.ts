import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

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
  productNames: string[]
  productConfiguration: string
  productUsageLimit: string
  validity: string
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
  ],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss'
})
export class StepTwoComponent {
  @Input() data!: StepTwoData;
  @Output() dataChange = new EventEmitter<StepTwoData>()

  form: FormGroup
  productNames: string[] = []

  configurationOptions = [
    { value: "percentual", label: "Percentual" },
    { value: "valor-fixo", label: "Valor fixo" },
  ]

  usageLimitOptions = [
    { value: "resgate-unico", label: "Resgate único" },
    { value: "multiplos-resgates", label: "Múltiplos resgates" },
  ]

  validityOptions = [
    { value: "1-dia", label: "1 dia"},
    { value: "7-dis", label: "7 dias"},
    { value: "15-dias", label: "15 dias"},
  ]

  productConfigurationOptions = [
    { value: "ao-cortar-o-cabelo", label: "Ao cortar o cabelo" },
    { value: "ao-fazer-barba", label: "Ao fazer barba" },
    { value: "ao-pintar-cabelo", label: "Ao pintar cabelo" },
  ]

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      date: ["", [Validators.required]],
      time: ["", [Validators.required]],
      productType: ["cupom", [Validators.required]],
      // Cupom fields
      couponCode: [""],
      configuration: ["percentual"],
      couponValue: [""],
      rescueValue: [""],
      usageLimit: ["resgate-unico"],
      validity: ["1-dia"],
      // Produto fields
      selectedProduct: [""],
      productConfiguration: ["ao-cortar-o-cabelo"],
      productUsageLimit: ["resgate-unico"],
      productValidity: ["1-dia"],
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
      selectedProduct: this.data.selectedProduct,
      productConfiguration: this.data.productConfiguration,
      productUsageLimit: this.data.productUsageLimit,
    })

    // Initialize product names
    this.productNames = [...this.data.productNames]

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
    const couponFields = ["couponCode", "configuration", "couponValue", "rescueValue", "usageLimit"]
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
    } else if (productType === "produto") {
      // Add validators for product fields
      productFields.forEach((field) => {
        this.form.get(field)?.setValidators([Validators.required])
        this.form.get(field)?.updateValueAndValidity()
      })
      // Remove validators for coupon fields
      couponFields.forEach((field) => {
        this.form.get(field)?.clearValidators()
        this.form.get(field)?.updateValueAndValidity()
      })
    } else {
      // Remove validators for all fields
      ;[...couponFields, ...productFields].forEach((field) => {
        this.form.get(field)?.clearValidators()
        this.form.get(field)?.updateValueAndValidity()
      })
    }
  }

  private emitFormData() {
    const formValue = this.form.value
    this.dataChange.emit({
      ...formValue,
      productNames: this.productNames,
    })
  }

  get showCouponFields(): boolean {
    return this.form.get("productType")?.value === "cupom"
  }

  get showProductFields(): boolean {
    return this.form.get("productType")?.value === "produto"
  }

  addProductName(productName: string) {
    if (productName.trim()) {
      this.productNames.push(productName.trim())
      this.form.get("selectedProduct")?.setValue("")
      this.emitFormData()
    }
  }

  removeProductName(index: number) {
    this.productNames.splice(index, 1)
    this.emitFormData()
  }

  onProductSelected(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault()
      const inputElement = event.target as HTMLInputElement
      this.addProductName(inputElement.value)
      inputElement.value = ""
    }
  }
}
