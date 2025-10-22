import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class HomeComponent {
  private router = inject(Router)
  private fb = inject(FormBuilder)
  private homeService = inject(HomeService)
  private toastr = inject(ToastrService)

  currentStep = signal<"email" | "password">("email")
  showPassword = false
  userEmail = ""
  isLoading = false

  form: FormGroup

  constructor() {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  onContinue() {
    if (this.currentStep() === "email") {
      if (this.form.get("email")?.valid) {
        this.userEmail = this.form.get("email")?.value
        this.currentStep.set("password")
      } else {
        this.form.get("email")?.markAsTouched()
      }
    } else {
      // Password step - login real com API
      if (this.form.get("password")?.valid && !this.isLoading) {
        this.isLoading = true;

        const loginData = {
          email: this.userEmail,
          password: this.form.get("password")?.value,
        };

        this.homeService.signin(loginData).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.toastr.success('Login realizado com sucesso!');

            // Redirecionar baseado no tipo de usuário
            if (this.userEmail.includes('franquia') || this.userEmail.includes('master')) {
              this.router.navigate(["/gerencial/dashboard"]);
            } else {
              this.router.navigate(["/franqueado/dashboard"]);
            }
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Erro no login:', error);
            this.toastr.error('Erro ao fazer login. Verifique suas credenciais.');
          }
        });
      } else {
        this.form.get("password")?.markAsTouched()
      }
    }
  }

  onBackToEmail() {
    this.currentStep.set("email")
    this.form.get("password")?.setValue("")
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

  onHelpClick() {
    console.log("Help clicked")
    // Here you would typically open a help modal or navigate to help page
  }

  onLearnMore() {
    console.log("Learn more clicked")
    // Here you would typically navigate to a learn more page
  }
}
