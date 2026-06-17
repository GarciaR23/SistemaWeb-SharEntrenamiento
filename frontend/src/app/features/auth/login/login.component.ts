import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '../../../core/services/auth-api.service';
import { HistorialRespuestaService } from '../../admin/services/historial-respuesta.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class Login {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authApiService = inject(AuthApiService);
  private historialService = inject(HistorialRespuestaService);
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

  showSubsanacionModal = false;
  documentosRechazados: string[] = [];
  idInstructorPendiente: number | null = null;

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

  irACorregirDocumentos(): void {
    this.showSubsanacionModal = false;
    this.router.navigate(['/instructor/documentos']);
  }

  obtenerDocumentosRechazados(): void {
    if (!this.idInstructorPendiente) return;
    this.historialService.obtenerDocumentosRechazados(this.idInstructorPendiente).subscribe({
      next: (docs) => {
        this.documentosRechazados = docs;
        this.showSubsanacionModal = true;
      },
      error: () => {
        this.errorMessage = 'No se pudieron obtener los documentos observados.';
        this.showErrorModal = true;
      }
    });
  }

  private mapAuthError(message: string): string {
    const normalized = (message || '').toLowerCase();
    if (/usuario inexistente|no existe|no encontrado/.test(normalized)) {
      return 'Usuario inexistente. Verifica tu correo o regístrate.';
    }
    if (/pendiente de validaci[oó]n|pendiente_validacion/.test(normalized)) {
      return 'Tu cuenta está pendiente de validación por el administrador.';
    }
    if (/subsanar|observaciones/.test(normalized)) {
      return 'El administrador revisó tus documentos. Tienes observaciones que debes corregir.';
    }
    if (/credenciales incorrectas/.test(normalized)) {
      return 'Credenciales incorrectas. Verifica tu correo y contraseña.';
    }
    return message || 'No se pudo iniciar sesión.';
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
          const msg = (response.message || '').toLowerCase();

          if (/subsanar|observaciones/.test(msg)) {
            this.idInstructorPendiente = response.idInstructor;
            this.obtenerDocumentosRechazados();
            return;
          }

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