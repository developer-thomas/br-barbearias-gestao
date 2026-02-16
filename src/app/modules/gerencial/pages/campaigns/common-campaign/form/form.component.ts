import { CommonCampaignService, CreateCommonCampaignRequest } from '../common-campaign.service';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { StepTwoComponent, StepTwoData } from './steps/step-two/step-two.component';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from "@angular/material/stepper"
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { Router } from '@angular/router';
import { StepFiveComponent } from './steps/step-five/step-five.component';
import { StepFourComponent } from './steps/step-four/step-four.component';
import { StepOneComponent } from './steps/step-one/step-one.component';
import { StepThreeComponent } from './steps/step-three/step-three.component';
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
  private commonCampaignService = inject(CommonCampaignService)
  private toastr = inject(ToastrService)

  @ViewChild(StepOneComponent) stepOneComponent!: StepOneComponent
  @ViewChild(StepTwoComponent) stepTwoComponent!: StepTwoComponent
  @ViewChild(StepThreeComponent) stepThreeComponent!: StepThreeComponent

  currentStep = signal(0)

  steps: StepData[] = [
    { label: "Campanha", completed: false, active: true },
    { label: "Período e produto", completed: false, active: false },
    { label: "Público e localização", completed: false, active: false },
    { label: "Imagem", completed: false, active: false },
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
      imageKey: null,
    } as any,
    step5: {
      sms: true,
      email: false,
      whatsapp: false,
    } as any,
  })

  onCancel() {
    this.router.navigate(["/gerencial/campanhas/comuns"])
  }

  onContinue() {
    const currentStepIndex = this.currentStep()

    // Validate current step before proceeding
    if (currentStepIndex === 0) {
      // highlight fields then validate
      this.stepOneComponent.markAsTouched();
      if (!this.stepOneComponent.isFormValid) {
        this.toastr.error('Preencha todos os campos obrigatórios', 'Erro de validação')
        return
      }
    }

    if (currentStepIndex === 1) {
      this.stepTwoComponent.markAsTouched();
      if (!this.stepTwoComponent.isFormValid) {
        this.toastr.error('Preencha todos os campos obrigatórios', 'Erro de validação')
        return
      }
    }

    if (currentStepIndex === 2) {
      this.stepThreeComponent.markAsTouched();
      if (!this.stepThreeComponent.isFormValid) {
        this.toastr.error('Selecione pelo menos uma localização', 'Erro de validação')
        return
      }
    }

    if (currentStepIndex < this.steps.length - 1) {
      // Mark current step as completed
      this.steps[currentStepIndex].completed = true
      this.steps[currentStepIndex].active = false

      // Move to next step
      const nextStep = currentStepIndex + 1
      this.currentStep.set(nextStep)
      this.steps[nextStep].active = true
    } else {
      // Last step, confirm and navigate
      this.onConfirm()
    }
  }

  onConfirm() {
    const formValues = this.formData()

    // Validate required fields
    if (!formValues.step1.title) {
      this.toastr.error('Preencha o título da campanha', 'Erro de validação')
      return
    }

    if (!formValues.step2.date) {
      this.toastr.error('Selecione a data de início da campanha', 'Erro de validação')
      return
    }

    if (!formValues.step3.locationNames || formValues.step3.locationNames.length === 0) {
      this.toastr.error('Selecione pelo menos uma localização', 'Erro de validação')
      return
    }

    // Map form data to API request format
    const requestData: CreateCommonCampaignRequest = {
      name: formValues.step1.title,
      description: formValues.step1.description,
      startAt: this.formatDateToISO(formValues.step2.date, formValues.step2.time),
      productType: this.mapProductType(formValues.step2.productType),
      couponCode: formValues.step2.couponCode || '',
      config: formValues.step2.configuration || 'percentual',
      couponValue: parseFloat(formValues.step2.couponValue) || 0,
      rescuedValue: parseInt(formValues.step2.rescueValue) || 1,
      rescueType: this.mapRescueType(formValues.step2.configuration),
      productsId: formValues.step2.productNames || [],
      productConfig: formValues.step2.productConfiguration || '',
      productRescue: formValues.step2.productUsageLimit || '',
      startAge: formValues.step3.ageFrom || 18,
      endAge: formValues.step3.ageTo || 100,
      gender: this.mapGender(formValues.step3.gender),
      franchiseeIds: formValues.step3.locationNames || [],
      sms: formValues.step5.sms === true,
      zapzap: formValues.step5.whatsapp === true,
      email: formValues.step5.email === true,
      imageUrl: formValues.step4.imageUrl || null,
      imageKey: formValues.step4.imageKey || null,
    }

    this.commonCampaignService.createCommonCampaign(requestData).subscribe({
      next: (response) => {
        this.toastr.success('Campanha criada com sucesso!', 'Sucesso')
        this.router.navigate(["/gerencial/campanhas/comuns"])
      },
      error: (error) => {
        // Error is handled by globalErrorInterceptor
        console.error('Erro ao criar campanha:', error)
      }
    })
  }

  private formatDateToISO(date: string, time: string): string {
    if (!date) return new Date().toISOString()

    // Combine date and time and convert to ISO 8601
    const timeValue = time || '00:00'
    const dateTimeString = `${date}T${timeValue}:00`
    const dateObject = new Date(dateTimeString)
    
    // Check if date is valid
    if (isNaN(dateObject.getTime())) {
      return new Date().toISOString()
    }
    
    return dateObject.toISOString()
  }

  private mapProductType(type: string): string {
    const typeMap: { [key: string]: string } = {
      'cupom': 'COUPON',
      'produto': 'PRODUCT',
      'nenhum': 'NONE'
    }
    return typeMap[type] || 'COUPON'
  }

  private mapRescueType(configuration: string): string {
    const typeMap: { [key: string]: string } = {
      'percentual': 'PERCENT',
      'valor': 'VALUE',
      'fixo': 'FIXED'
    }
    return typeMap[configuration] || 'PERCENT'
  }

  private mapGender(gender: string): string {
    const genderMap: { [key: string]: string } = {
      'homens-e-mulheres': 'BOTH',
      'homens': 'MALE',
      'mulheres': 'FEMALE',
      'outros': 'OTHER'
    }
    return genderMap[gender] || 'BOTH'
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

  public goToStep(index: number): void {
    if (index < 0 || index >= this.steps.length) return;

    // set active flags and keep completed state for previous steps
    this.steps = this.steps.map((s, i) => ({
      ...s,
      active: i === index,
      completed: i < index ? true : s.completed && i === index ? s.completed : i < this.currentStep() ? true : s.completed
    }));

    this.currentStep.set(index);
  }
}
