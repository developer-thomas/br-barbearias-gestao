import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirstStepComponent } from './pages/first-step/first-step.component';
import { SecondStepComponent } from './pages/second-step/second-step.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  imports: [
    FirstStepComponent,
    SecondStepComponent,
  ],
})
export class ForgotPasswordComponent {
  private router = inject(Router);

  public step = 1;

  nextStep() {
    this.step++;
  }

  gotoLogin() {
    this.router.navigate(['/']);
  }
}
