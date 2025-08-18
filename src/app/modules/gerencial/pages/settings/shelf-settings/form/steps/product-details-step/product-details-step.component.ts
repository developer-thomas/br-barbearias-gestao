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
  rescueValue: string
  validity: string
  discount: string
  rule: string
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
    rule: "cupom-unico",
  }
  @Output() dataChange = new EventEmitter<ProductDetailsData>()

  form: FormGroup

  ruleOptions = [
    { value: "cupom-unico", label: "Cupom único" },
    { value: "cupom-multiplo", label: "Cupom múltiplo" },
    { value: "desconto-progressivo", label: "Desconto progressivo" },
  ]

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      productName: ["", [Validators.required]],
      description: ["", [Validators.required]],
      rescueValue: ["", [Validators.required]],
      validity: ["", [Validators.required]],
      discount: ["", [Validators.required]],
      rule: ["cupom-unico", [Validators.required]],
    })
  }

  ngOnInit() {
    // Initialize form with input data
    this.form.patchValue(this.data)

    // Emit changes when form values change
    this.form.valueChanges.subscribe((value) => {
      this.dataChange.emit(value)
    })
  }
}
