import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  showPassword = false;
  isLoading = false;
  feedbackMessage = '';

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    this.isLoading = true;
    this.feedbackMessage = '';

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.feedbackMessage = 'Inicio de sesión exitoso.';

        if (response.role === 'tutor') {
          this.router.navigate(['/tutor']);
          return;
        }

        this.router.navigate(['/formulario']);
      },
      error: (error) => {
        this.isLoading = false;
        const backendMessage = error?.error?.message;
        this.feedbackMessage = backendMessage || 'No se pudo iniciar sesión. Verifica tus credenciales.';
      },
    });
  }

  isMenuOpen = false;

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
