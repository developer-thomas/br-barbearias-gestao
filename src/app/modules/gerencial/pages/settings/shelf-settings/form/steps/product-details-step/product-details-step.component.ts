import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';

export interface ProductDetailsData {
  productName: string
  description: string
  rescueValue: string | number
  validity: string
  discount: string | number
  rule: 'UNIQUE' | 'MULTIPLE'
}

@Component({
  selector: 'app-product-details-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxMaskDirective
  ],
  templateUrl: './product-details-step.component.html',
  styleUrl: './product-details-step.component.scss'
})
export class ProductDetailsStepComponent {
  @Input() data: ProductDetailsData = {
    productName: "",
    description: "",
    rescueValue: "",
    validity: "",
    discount: "",
    rule: "UNIQUE",
  }
  @Output() dataChange = new EventEmitter<ProductDetailsData>()

  form: FormGroup

  ruleOptions = [
    { value: "UNIQUE" as const, label: "Cupom único" },
    { value: "MULTIPLE" as const, label: "Cupom múltiplo" },
  ]

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      productName: ["", [Validators.required]],
      description: ["", [Validators.required]],
      rescueValue: ["", [Validators.required]],
      validity: ["", [Validators.required]],
      discount: ["", [Validators.required]],
      rule: ["UNIQUE", [Validators.required]],
    })
  }

  ngOnInit() {
    // Initialize form with input data
    this.form.patchValue(this.data)

    // Emit changes when form values change
    this.form.valueChanges.subscribe((value) => {
      this.dataChange.emit(value as ProductDetailsData)
    })
  }
}
