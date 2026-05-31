import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '../../../services/auth-api.service';
import { HeaderComponent } from "../../../layouts/header/header.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, CommonModule, RouterLink, HeaderComponent],
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
  errorTitle = 'Error de autenticación';
  showErrorModal = false;
  showSuccessModal = false;
  successMessage = 'Bienvenido, Usuario';

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.router.navigate([this.pendingRedirectUrl]);
  }

  private mapAuthError(message: string): string {
    const normalized = (message || '').toLowerCase();
    if (/usuario inexistente|no existe|no encontrado/.test(normalized)) {
      return 'Usuario inexistente. Verifica tu correo o regístrate si aún no tienes cuenta.';
    }

    if (/cuenta no activada|no activada|pendiente.*activaci[oó]n|pendiente_validacion|pendiente de validaci[oó]n/.test(normalized)) {
      return 'Tu cuenta no ha sido activada. Revisa tu correo para completar la validación.';
    }

    if (/credenciales incorrectas|contraseñ(a|as) incorrect(a|as)|usuario o contraseña|password incorrecto|email o contraseña/.test(normalized)) {
      return 'Credenciales incorrectas. Verifica tu correo y contraseña e inténtalo de nuevo.';
    }

    return message || 'No se pudo iniciar sesión. Intenta de nuevo más tarde.';
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
          this.errorMessage = this.mapAuthError(response.message || 'No se pudo iniciar sesión');
          this.showErrorModal = true;
          return;
        }

        localStorage.setItem('authUser', JSON.stringify(response.usuario));

        this.pendingRedirectUrl = '/';

        if (response.usuario.rol === 'tutor') {
          this.pendingRedirectUrl = '/tutor';
        }

        if (response.usuario.rol === 'instructor') {
          this.pendingRedirectUrl = '/instructor';
        }

        if(response.usuario.rol == 'admin'){
          this.pendingRedirectUrl = '/admin'
        }

        this.successMessage = 'Bienvenido, Usuario';
        this.showSuccessModal = true;
      },
      error: (error) => {
        this.loading = false;
        const rawMessage = error?.error?.message ?? 'Error de conexión con el servidor';
        this.errorMessage = this.mapAuthError(rawMessage);
        this.showErrorModal = true;
      },
    });
  }

  isMenuOpen = false;

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
