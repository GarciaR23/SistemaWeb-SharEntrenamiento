import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '../../../services/auth-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authApiService = inject(AuthApiService);
  private pendingRedirectUrl = '/';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  showPassword = false;
  loading = false;
  errorMessage = '';
  showSuccessModal = false;
  successMessage = 'Bienvenido, Usuario';

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.router.navigate([this.pendingRedirectUrl]);
  }

  onSubmit() {
    if (this.loginForm.invalid || this.loading) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    this.loading = true;
    this.errorMessage = '';

    this.authApiService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;

        if (!response.success || !response.usuario) {
          this.errorMessage = response.message || 'No se pudo iniciar sesión';
          return;
        }

        localStorage.setItem('authUser', JSON.stringify(response.usuario));

        this.pendingRedirectUrl = '/';

        if (response.usuario.rol === 'tutor') {
          this.pendingRedirectUrl = '/tutor';
        }

        if (response.usuario.rol === 'instructor') {
          this.pendingRedirectUrl = '/formulario';
        }

        this.successMessage = 'Bienvenido, Usuario';
        this.showSuccessModal = true;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message ?? 'Error de conexión con el servidor';
      },
    });
  }

  isMenuOpen = false;

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
