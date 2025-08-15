import { Component, inject } from '@angular/core';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    PageHeaderComponent,
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

  public form!: FormGroup;

  constructor() {
    this.form = this.fb.group({
      search: ['', [Validators.required]],
      smartSearch: ['', [Validators.required]],
      productBuy: ['', [Validators.required]],
      serviceBuy: ['', [Validators.required]]
    })
  }

  onSubmit() {}

  goBack() {
    this.form.reset()
  }
}
