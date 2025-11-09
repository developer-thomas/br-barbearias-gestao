import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';
import { RouterModule } from '@angular/router';
import { ScoreSettingsService, UpdateScoreRequest } from '../score-settings.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    PageHeaderComponent,
  CommonModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    BaseButtonComponent,
    RouterModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  private fb = inject(FormBuilder);
  private scoreSettingsService = inject(ScoreSettingsService);
  private toastr = inject(ToastrService);

  public form!: FormGroup;
  public isSubmitting = signal(false);

  constructor() {
    this.form = this.fb.group({
      search: ['', [Validators.required]],
      intelSearch: ['', [Validators.required]],
      sale: ['', [Validators.required]],
      service: ['', [Validators.required]]
    })
  }

  onSubmit() {
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
      this.toastr.error('Informe valores numéricos válidos para cada pontuação.');
      return;
    }

    this.isSubmitting.set(true);

    this.scoreSettingsService
      .updateScoreConfiguration(payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          const message = response?.message ?? 'Configuração atualizada com sucesso.';
          this.toastr.success(message);
        },
        error: (error) => {
          console.error('Erro ao atualizar configuração de pontuação', error);
          this.toastr.error('Não foi possível atualizar a configuração de pontuação. Tente novamente.');
        },
      });
  }

  onCancel() {
    if (this.isSubmitting()) {
      return;
    }

    this.form.reset();
  }

  private buildPayload(): UpdateScoreRequest | null {
    const values = this.form.value;

    const parseField = (value: unknown): number | null => {
      if (value === null || value === undefined) {
        return null;
      }

      if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
      }

      const sanitized = String(value).replace(/[^0-9]/g, '');

      if (!sanitized) {
        return null;
      }

      const parsed = Number(sanitized);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const payload = {
      search: parseField(values.search),
      intelSearch: parseField(values.intelSearch),
      sale: parseField(values.sale),
      service: parseField(values.service),
    };

    const hasInvalidField = Object.values(payload).some((value) => value === null);

    if (hasInvalidField) {
      return null;
    }

    return payload as UpdateScoreRequest;
  }
}
