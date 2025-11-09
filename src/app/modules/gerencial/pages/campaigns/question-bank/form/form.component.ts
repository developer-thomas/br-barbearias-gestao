import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { QuestionBankService, CreateQuestionRequest, QuestionTarget, QuestionType } from '../question-bank.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    PageHeaderComponent,
    MatCardModule,
    MatIcon,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    BaseButtonComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private questionBankService = inject(QuestionBankService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  form: FormGroup;
  isSubmitting = signal(false);

  targetOptions: { value: QuestionTarget; label: string }[] = [
    { value: 'FRANCHISEE', label: 'Franqueado' },
    { value: 'CLIENT', label: 'Cliente' },
  ];

  questionTypeOptions: { value: QuestionType; label: string }[] = [
    { value: 'MULTIPLE_CHOICE', label: 'Múltipla escolha' },
    { value: 'SINGLE_CHOICE', label: 'Escolha única' },
    { value: 'TEXT', label: 'Resposta aberta' },
  ];

  constructor() {
    this.form = this.fb.group({
      target: ['FRANCHISEE' as QuestionTarget, Validators.required],
      type: ['MULTIPLE_CHOICE' as QuestionType, Validators.required],
      title: ['', Validators.required]
    })
  }

  ngOnInit(): void {}

  submit() {
    if (this.isSubmitting()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const payload = this.buildPayload();

    if (!payload) {
      this.toastr.error('Informe a pergunta que será cadastrada.');
      return;
    }

    this.isSubmitting.set(true);

    this.questionBankService
      .createQuestion(payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          const message = response?.message ?? 'Pergunta criada com sucesso.';
          this.toastr.success(message);
          this.router.navigate(['/gerencial/campanhas/banco-perguntas']);
        },
        error: (error) => {
          console.error('Erro ao criar pergunta', error);
          this.toastr.error('Não foi possível criar a pergunta. Tente novamente.');
        },
      });
  }

  openModal() {
    this.dialog.open(ModalComponent, {
      width: '800px',
      data: { exemplo: 'algum dado' }
    })
  }

  onCancel(): void {
    this.router.navigate(['/gerencial/campanhas/banco-perguntas']);
  }

  private buildPayload(): CreateQuestionRequest | null {
    const target = this.form.get('target')?.value as QuestionTarget;
    const type = this.form.get('type')?.value as QuestionType;
    const titleControl = this.form.get('title');
    const rawTitle = titleControl?.value ?? '';
    const trimmedTitle = typeof rawTitle === 'string' ? rawTitle.trim() : '';

    if (!trimmedTitle) {
      titleControl?.setValue(trimmedTitle, { emitEvent: false });
      titleControl?.markAsTouched();
      titleControl?.setErrors({ required: true });
      return null;
    }

    titleControl?.setValue(trimmedTitle, { emitEvent: false });

    return {
      target,
      type,
      title: trimmedTitle,
    };
  }
}
