import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ProductDetailsData, ProductDetailsStepComponent } from './steps/product-details-step/product-details-step.component';
import { ProductImageData, ProductImageStepComponent } from './steps/product-image-step/product-image-step.component';

export interface StepData {
  label: string
  completed: boolean
  active: boolean
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    ProductDetailsStepComponent, 
    ProductImageStepComponent,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  private router = inject(Router)

  currentStep = signal(0)

  steps: StepData[] = [
    { label: "Detalhes produto", completed: false, active: true },
    { label: "Imagem do produto", completed: false, active: false },
  ]

  formData = signal({
    productDetails: {
      productName: "",
      description: "",
      rescueValue: "",
      validity: "",
      discount: "",
      rule: "",
    },
    productImage: {
      imageUrl: null,
    },
  })

  onCancel() {
    this.router.navigate(["/gerencial/configuracao/prateleira"])
  }

  onContinue() {
    if (this.currentStep() < this.steps.length - 1) {
      // Mark current step as completed
      this.steps[this.currentStep()].completed = true
      this.steps[this.currentStep()].active = false

      // Move to next step
      const nextStep = this.currentStep() + 1
      this.currentStep.set(nextStep)
      this.steps[nextStep].active = true
    } else {
      // Last step, confirm and navigate
      this.onConfirm()
    }
  }

  onConfirm() {
    console.log("Configurações de prateleira finalizadas:", this.formData())
    // Here you would typically send the data to a server
    this.router.navigate(["/gerencial/configuracao/prateleira"])
  }

  onProductDetailsChange(data: ProductDetailsData) {
    this.formData.update((current) => ({ ...current, productDetails: data }))
  }

  onProductImageChange(data: ProductImageData) {
    this.formData.update((current) => ({ ...current, productImage: data }))
  }
}
