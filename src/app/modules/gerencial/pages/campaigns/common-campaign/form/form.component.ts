import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from "@angular/material/stepper"
import { MatIconModule } from '@angular/material/icon';
import { StepOneComponent } from './steps/step-one/step-one.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { StepTwoComponent, StepTwoData } from './steps/step-two/step-two.component';
import { StepThreeComponent } from './steps/step-three/step-three.component';
import { Router } from '@angular/router';
import { StepFourComponent } from './steps/step-four/step-four.component';
import { StepFiveComponent } from './steps/step-five/step-five.component';

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
    MatStepperModule, 
    MatButtonModule, 
    MatIconModule, 
    StepOneComponent,
    PageHeaderComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent,
    StepFiveComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  private router = inject(Router)

  currentStep = signal(0)

  steps: StepData[] = [
    { label: "Campanha", completed: false, active: true },
    { label: "Período e produto", completed: false, active: false },
    { label: "Público e localização", completed: false, active: false },
    { label: "Mensagens", completed: false, active: false },
    { label: "Posicionamento", completed: false, active: false },
  ]

  // Form data to be passed between steps
  formData = signal({
    step1: {
      title: "",
      description: "",
    } as any,
    step2: {
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
    } as any,
    step3: {
      ageFrom: 20,
      ageTo: 50,
      gender: "homens-e-mulheres",
      selectedLocation: "",
      locationNames: [],
    } as any,
    step4: {
      imageUrl: null,
    } as any,
    step5: {
      sms: true,
      email: false,
      whatsapp: false,
    } as any,
  })

  onCancel() {
    this.router.navigate(["../"])
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
    console.log("Formulário finalizado:", this.formData())
    // Here you would typically send the data to a server
    this.router.navigate(["/gerencial/campanhas/comuns"])
  }

  onStepDataChange(stepData: any) {
    this.formData.update((current) => ({ ...current, step1: stepData }))
  }

  onStep2DataChange(stepData: any) {
    this.formData.update((current) => ({ ...current, step2: stepData }))
  }

  onStep3DataChange(stepData: any) {
    this.formData.update((current) => ({ ...current, step3: stepData }))
  }

  onStep4DataChange(stepData: any) {
    this.formData.update((current) => ({ ...current, step4: stepData }))
  }

  onStep5DataChange(stepData: any) {
    this.formData.update((current) => ({ ...current, step5: stepData }))
  }
}
