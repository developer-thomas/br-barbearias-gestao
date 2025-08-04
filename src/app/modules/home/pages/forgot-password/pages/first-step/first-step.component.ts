import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-first-step',
  standalone: true,
  templateUrl: './first-step.component.html',
  styleUrl: './first-step.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
})
export class FirstStepComponent {
  private fb = inject(FormBuilder);

  @Output() nextStep = new EventEmitter<any>();

  public form = this.fb.group({
    credential: [''],
  });

  onSubmit() {
    // implement login
    this.nextStep.emit();
  }
}
