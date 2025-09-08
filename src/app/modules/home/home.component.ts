import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterOutlet } from '@angular/router';

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

  currentStep = signal<"email" | "password">("email")
  showPassword = false
  userEmail = ""

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
      // Password step - login
      if (this.form.get("password")?.valid) {
        console.log("Login attempt:", {
          email: this.userEmail,
          password: this.form.get("password")?.value,
        })

        if(this.userEmail === 'user@franquia.com') {
          this.router.navigate(["/gerencial/dashboard"])
        } else if (this.userEmail === 'user@franqueado.com') {
          this.router.navigate(["/franqueado/dashboard"])
        }
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
