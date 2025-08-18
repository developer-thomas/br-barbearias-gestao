import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { BannerDetailsStepComponent, BannerDetailsData } from './steps/banner-details-step/banner-details-step.component';
import { BannerImageData, BannerImageStepComponent } from './steps/banner-image-step/banner-image-step.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

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

  currentStep = signal(0)

  steps: StepData[] = [
    { label: "Detalhes Banner", completed: false, active: true },
    { label: "Imagem do Banner", completed: false, active: false },
  ]

  formData = signal({
    bannerDetails: {
      title: "",
      link: "",
      startDate: "",
      endDate: "",
      targetAudience: "",
      selectedLocation: "",
      locations: [""],
    },
    bannerImage: {
      imageUrl: null,
    },
  })

  onCancel() {
    this.router.navigate(["/gerencial/banners"])
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
      this.onConfirm()
    }
  }

  onConfirm() {
    console.log("Banner finalizado:", this.formData())
    // Here you would typically send the data to a server
    this.router.navigate(["/gerencial/banners"])
  }

  onBannerDetailsChange(data: BannerDetailsData) {
    this.formData.update((current) => ({ ...current, bannerDetails: data }))
  }

  onBannerImageChange(data: BannerImageData) {
    this.formData.update((current) => ({ ...current, bannerImage: data }))
  }
}
