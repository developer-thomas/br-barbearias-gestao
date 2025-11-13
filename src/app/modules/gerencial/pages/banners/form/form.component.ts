import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { BannerDetailsStepComponent, BannerDetailsData } from './steps/banner-details-step/banner-details-step.component';
import { BannerImageData, BannerImageStepComponent } from './steps/banner-image-step/banner-image-step.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { BannersService, CreateBannerResponse } from '../banners.service';
import { ToastrService } from 'ngx-toastr';

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
    BannerDetailsStepComponent,
    BannerImageStepComponent,
    PageHeaderComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  private router = inject(Router)
  private bannersService = inject(BannersService)
  private toastr = inject(ToastrService)

  currentStep = signal(0)
  isSubmitting = signal(false)

  steps: StepData[] = [
    { label: "Detalhes Banner", completed: false, active: true },
    { label: "Imagem do Banner", completed: false, active: false },
  ]

  formData = signal<{
    bannerDetails: BannerDetailsData
    bannerImage: BannerImageData
  }>({
    bannerDetails: {
      title: "",
      link: "",
      startDate: "",
      endDate: "",
      target: "BRANCH",
      franchiserIds: "",
      selectedLocation: "",
      locations: [],
    },
    bannerImage: {
      previewUrl: null,
      file: null,
    },
  })

  onCancel() {
    if (this.isSubmitting()) {
      return
    }
    this.router.navigate(["/gerencial/banners"])
  }

  onContinue() {
    if (this.isSubmitting()) {
      return
    }

    if (this.currentStep() < this.steps.length - 1) {
      if (!this.isBannerDetailsStepValid()) {
        return
      }
      // Mark current step as completed
      this.steps[this.currentStep()].completed = true
      this.steps[this.currentStep()].active = false

      // Move to next step
      const nextStep = this.currentStep() + 1
      this.currentStep.set(nextStep)
      this.steps[nextStep].active = true
    } else {
      this.onConfirm()
    }
  }

  onConfirm() {
    if (this.isSubmitting()) {
      return
    }

    const details = this.formData().bannerDetails
    const image = this.formData().bannerImage

    const validation = this.buildCreateBannerFormData(details, image)

    if (!validation.success) {
      this.toastr.error(validation.error)
      return
    }

    this.isSubmitting.set(true)

    this.bannersService
      .createBanner(validation.formData)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response: CreateBannerResponse) => {
          const message = response?.message ?? 'Banner cadastrado com sucesso.'
          this.toastr.success(message)
          this.router.navigate(["/gerencial/banners"])
        },
        error: (error: unknown) => {
          console.error('Erro ao cadastrar banner', error)
          this.toastr.error('Não foi possível cadastrar o banner. Tente novamente.')
        },
      })
  }

  onBannerDetailsChange(data: BannerDetailsData) {
    this.formData.update((current) => ({ ...current, bannerDetails: data }))
  }

  onBannerImageChange(data: BannerImageData) {
    this.formData.update((current) => ({ ...current, bannerImage: data }))
  }

  private isBannerDetailsStepValid(): boolean {
    const details = this.formData().bannerDetails
    const requiredFields = [
      details.title,
      details.link,
      details.startDate,
      details.endDate,
      details.target,
      details.franchiserIds,
    ]

    if (requiredFields.some((field) => !field || String(field).trim() === "")) {
      this.toastr.error('Preencha todos os dados obrigatórios antes de continuar.')
      return false
    }

    if (!details.locations?.length) {
      this.toastr.error('Adicione pelo menos uma localização para o banner.')
      return false
    }

    const franchiserIds = this.parseFranchiserIds(details.franchiserIds)

    if (!franchiserIds.length) {
      this.toastr.error('Informe pelo menos um ID de franquia válido.')
      return false
    }

    const startDate = this.parseDate(details.startDate)
    const endDate = this.parseDate(details.endDate)

    if (!startDate || !endDate) {
      this.toastr.error('Informe datas válidas no formato DD/MM/AAAA.')
      return false
    }

    return true
  }

  private buildCreateBannerFormData(details: BannerDetailsData, image: BannerImageData):
    | { success: true; formData: FormData }
    | { success: false; error: string } {
    const title = details.title?.trim()
    const link = details.link?.trim()
    const target = details.target
    const franchiserIds = this.parseFranchiserIds(details.franchiserIds)
    const startDate = this.parseDate(details.startDate)
    const endDate = this.parseDate(details.endDate)
    const locationInfo = this.extractCityAndState(details.locations)

    if (!title || !link || !target) {
      return { success: false, error: 'Preencha todos os dados obrigatórios antes de concluir.' }
    }

    if (!franchiserIds.length) {
      return { success: false, error: 'Informe pelo menos um ID de franquia válido.' }
    }

    if (!startDate || !endDate) {
      return { success: false, error: 'Informe datas válidas no formato DD/MM/AAAA.' }
    }

    if (!locationInfo) {
      return { success: false, error: 'Selecione uma localização válida para o banner.' }
    }

    if (!image.file) {
      return { success: false, error: 'Adicione uma imagem para concluir o cadastro do banner.' }
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('link', link)
    formData.append('startDate', startDate)
    formData.append('endDate', endDate)
    formData.append('target', target)
    franchiserIds.forEach((id) => formData.append('franchiserIds', String(id)))
    formData.append('state', locationInfo.state)
    formData.append('city', locationInfo.city)
    formData.append('file', image.file)

    return { success: true, formData }
  }

  private parseFranchiserIds(value: string): number[] {
    if (!value) {
      return []
    }

    return value
      .split(',')
      .map((item) => Number(item.trim()))
      .filter((id) => Number.isFinite(id) && id > 0)
  }

  private parseDate(value: string): string | null {
    if (!value) {
      return null
    }

    const digits = value.replace(/[^0-9]/g, '')

    if (digits.length !== 6 && digits.length !== 8) {
      return null
    }

    const day = Number(digits.slice(0, 2))
    const month = Number(digits.slice(2, 4))
    const yearDigits = digits.slice(4)
    const year = Number(yearDigits.length === 2 ? `20${yearDigits}` : yearDigits)

    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
      return null
    }

    const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))

    if (isNaN(date.getTime())) {
      return null
    }

    if (date.getUTCDate() !== day || date.getUTCMonth() !== month - 1 || date.getUTCFullYear() !== year) {
      return null
    }

    return date.toISOString()
  }

  private extractCityAndState(locations: string[]): { city: string; state: string } | null {
    if (!Array.isArray(locations) || !locations.length) {
      return null
    }

    const [firstLocation] = locations

    if (!firstLocation) {
      return null
    }

    const [cityPart, statePart] = firstLocation.split('-').map((part) => part.trim())

    if (!cityPart || !statePart) {
      return null
    }

    return { city: cityPart, state: statePart }
  }
}
