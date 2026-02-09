import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
  productNames: string[]
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
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss'
})
export class StepTwoComponent {
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

  productConfigurationOptions = [
    { value: "ao-cortar-o-cabelo", label: "Ao cortar o cabelo" },
    { value: "ao-fazer-barba", label: "Ao fazer barba" },
    { value: "ao-pintar-cabelo", label: "Ao pintar cabelo" },
  ]

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      date: [null, [Validators.required]],
      time: [""],
      productType: ["cupom", [Validators.required]],
      // Cupom fields
      couponCode: [""],
      configuration: ["percentual"],
      couponValue: [""],
      rescueValue: [""],
      usageLimit: ["resgate-unico"],
      // Produto fields
      selectedProduct: [""],
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
    const couponFields = ["couponCode", "configuration", "couponValue", "rescueValue"]
    const productFields = ["selectedProduct", "productConfiguration", "productUsageLimit"]

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
      // Add validators for selectedProduct only
      this.form.get("selectedProduct")?.setValidators([Validators.required])
      this.form.get("selectedProduct")?.updateValueAndValidity()
      // Remove validators for other product fields
      const otherProductFields = ["productConfiguration", "productUsageLimit"]; otherProductFields.forEach((field) => {
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
      const allFields = [...couponFields, "selectedProduct", "productConfiguration", "productUsageLimit", "usageLimit"];
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

  get isFormValid(): boolean {
    return this.form.valid
  }
}
