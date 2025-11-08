import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ProductDetailsData, ProductDetailsStepComponent } from './steps/product-details-step/product-details-step.component';
import { ProductImageData, ProductImageStepComponent } from './steps/product-image-step/product-image-step.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { CreateShelfRequest, ShelfSettingsService } from '../shelf-settings.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

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
    PageHeaderComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  private router = inject(Router)
  private shelfSettingsService = inject(ShelfSettingsService)
  private toastr = inject(ToastrService)

  currentStep = signal(0)
  isSubmitting = signal(false)

  steps: StepData[] = [
    { label: "Detalhes produto", completed: false, active: true },
    { label: "Imagem do produto", completed: false, active: false },
  ]

  formData = signal<{ productDetails: ProductDetailsData; productImage: ProductImageData }>({
    productDetails: {
      productName: "",
      description: "",
      rescueValue: "",
      validity: "",
      discount: "",
      rule: "UNIQUE" as const,
    },
    productImage: {
      imageUrl: null,
    },
  })

  onCancel() {
    this.router.navigate(["/gerencial/configuracao/prateleira"])
  }

  onContinue() {
    if (this.isSubmitting()) {
      return
    }

    if (this.currentStep() === 0 && !this.isProductDetailsValid(this.formData().productDetails)) {
      this.toastr.error('Preencha todos os dados obrigatórios do produto antes de continuar.')
      return
    }

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
    if (this.isSubmitting()) {
      return
    }

    const buildResult = this.buildCreateShelfPayload()

    if (!buildResult.success) {
      this.toastr.error(buildResult.error)
      return
    }

    this.isSubmitting.set(true)

    this.shelfSettingsService
      .createShelf(buildResult.payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          const message = response?.message ?? 'Prateleira criada com sucesso.'
          this.toastr.success(message)
          this.router.navigate(["/gerencial/configuracao/prateleira"])
        },
        error: (error) => {
          console.error('Erro ao cadastrar prateleira', error)
          this.toastr.error('Não foi possível cadastrar a prateleira. Tente novamente.')
        },
      })
  }

  onProductDetailsChange(data: ProductDetailsData) {
    this.formData.update((current) => ({ ...current, productDetails: data }))
  }

  onProductImageChange(data: ProductImageData) {
    this.formData.update((current) => ({ ...current, productImage: data }))
  }

  private isProductDetailsValid(details: ProductDetailsData): boolean {
    const requiredFields = [
      details.productName,
      details.description,
      details.rescueValue,
      details.validity,
      details.discount,
      details.rule,
    ]

    return requiredFields.every((field) => field !== null && field !== undefined && String(field).trim() !== '')
  }

  private buildCreateShelfPayload():
    | { success: true; payload: CreateShelfRequest }
    | { success: false; error: string } {
    const { productDetails } = this.formData()

  const points = this.parsePoints(productDetails.rescueValue)
  const discount = this.parseDiscount(productDetails.discount)
    const expirateAt = this.parseDate(productDetails.validity)

    if (points === null) {
      return {
        success: false,
        error: 'Informe um valor de resgate válido para a prateleira.',
      }
    }

    if (discount === null) {
      return {
        success: false,
        error: 'Informe um desconto válido antes de concluir o cadastro.',
      }
    }

    if (!expirateAt) {
      return {
        success: false,
        error: 'Informe uma validade válida no formato DD/MM/AAAA.',
      }
    }

    return {
      success: true,
      payload: {
        name: productDetails.productName.trim(),
        description: productDetails.description.trim(),
        points,
        expirateAt,
        discount,
        rule: productDetails.rule as CreateShelfRequest['rule'],
      },
    }
  }

  private parsePoints(value: string | number): number | null {
    if (value === null || value === undefined || value === '') {
      return null
    }

    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null
    }

    const normalized = value.replace(/[^\d]/g, '')

    if (!normalized) {
      return null
    }

    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : null
  }

  private parseDiscount(value: string | number): number | null {
    if (value === null || value === undefined || value === '') {
      return null
    }

    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null
    }

    const sanitized = value.replace(',', '.').trim()
    const parsed = Number(sanitized)
    return Number.isFinite(parsed) ? parsed : null
  }

  private parseDate(value: string): string | null {
    if (!value) {
      return null
    }

    const digits = value.replace(/\D/g, '')

    if (digits.length !== 6 && digits.length !== 8) {
      return null
    }

    const dayDigits = digits.slice(0, 2)
    const monthDigits = digits.slice(2, 4)
    const yearDigits = digits.slice(4)

    const normalizedYear =
      yearDigits.length === 2 ? `20${yearDigits}` : yearDigits

    const dayNumber = Number(dayDigits)
    const monthNumber = Number(monthDigits)
    const yearNumber = Number(normalizedYear)

    if (
      !Number.isInteger(dayNumber) ||
      !Number.isInteger(monthNumber) ||
      !Number.isInteger(yearNumber)
    ) {
      return null
    }

    const jsDate = new Date(yearNumber, monthNumber - 1, dayNumber)

    if (isNaN(jsDate.getTime())) {
      return null
    }

    if (
      jsDate.getDate() !== dayNumber ||
      jsDate.getMonth() !== monthNumber - 1 ||
      jsDate.getFullYear() !== yearNumber
    ) {
      return null
    }

    const utcDate = new Date(Date.UTC(yearNumber, monthNumber - 1, dayNumber))
    return utcDate.toISOString()
  }
}
