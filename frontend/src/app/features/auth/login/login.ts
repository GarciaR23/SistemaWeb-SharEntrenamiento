import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '../../../core/services/auth-api.service';
import { HeaderComponent } from "../../../shared/components/header/header.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, HeaderComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
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

        const rol = response.usuario.rol;

        const roles = ['admin', 'tutor', 'instructor'];
        let sesionActiva: string | null = null;

        for (const r of roles) {
          if (localStorage.getItem(`authToken_${r}`)) {
            sesionActiva = r;
            break;
          }
        }

        if (sesionActiva) {
          this.errorTitle = 'Sesión activa detectada';
          this.errorMessage = `Ya tienes una sesión abierta como ${sesionActiva} en otra pestaña. Debes cerrar esa sesión antes de iniciar con otra cuenta.`;
          this.showErrorModal = true;
          return;
        }

        localStorage.setItem(`authToken_${rol}`, response.token);
        localStorage.setItem(`authUser_${rol}`, JSON.stringify(response.usuario));

        this.pendingRedirectUrl = `/${rol}/inicio`;
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