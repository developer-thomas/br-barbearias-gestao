import { Component, inject, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';

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
    MatInputModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      linkedTo: ['', Validators.required],
      questionCategory: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  ngOnInit(): void {}

  likedToOptions = [
    { id: 0, value: 'Franquia 01' },
    { id: 1, value: 'Franquia 02' },
    { id: 2, value: 'Franquia 03' },
    { id: 3, value: 'Franquia 04' },
  ]

  categoryQuestion = [
    { id: 0, value: 'Franquia 01' },
    { id: 1, value: 'Franquia 02' },
    { id: 2, value: 'Franquia 03' },
    { id: 3, value: 'Franquia 04' },
  ]

  submit() {

  }

  openModal() {
    this.dialog.open(ModalComponent, {
      width: '800px',
      data: { exemplo: 'algum dado' }
    })
  }
}
