import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '../../../core/services/auth-api.service';
import { HistorialRespuestaService } from '../../admin/services/historial-respuesta.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { DocumentoObservado } from '../models/documento-observado.model';
import { SubsanacionDocumentosService } from '../services/subsanacion-documentos.service';

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
  private subsanacionDocumentosService = inject(SubsanacionDocumentosService);

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
  showDocumentosCorreccionModal = false;
  documentosRechazados: string[] = [];
  idInstructorPendiente: number | null = null;
  idInstructorSubsanacion: number | null = null;
  documentosObservados: DocumentoObservado[] = [];

  loadingDocumentos = false;
  enviandoCorreccion = false;
  errorCorreccion = '';
  successCorreccion = '';

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
    if (!this.idInstructorSubsanacion && this.idInstructorPendiente) {
      this.idInstructorSubsanacion = this.idInstructorPendiente;
    }

    if (!this.idInstructorSubsanacion) {
      this.errorCorreccion = 'No se encontró el instructor asociado a la cuenta.';
      this.showSubsanacionModal = false;
      this.showDocumentosCorreccionModal = true;
      return;
    }

    this.showSubsanacionModal = false;
    this.showDocumentosCorreccionModal = true;
    this.cargarDocumentosObservados();
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
      },
    });
  }

  cargarDocumentosObservados(): void {
    if (!this.idInstructorSubsanacion) {
      this.errorCorreccion = 'No se encontró el instructor asociado a la cuenta.';
      return;
    }

    this.loadingDocumentos = true;
    this.errorCorreccion = '';
    this.successCorreccion = '';
    this.documentosObservados = [];

    this.subsanacionDocumentosService
      .obtenerDocumentosObservados(this.idInstructorSubsanacion)
      .subscribe({
        next: (documentos) => {
          this.documentosObservados = documentos;
          this.loadingDocumentos = false;
        },
        error: () => {
          this.errorCorreccion = 'No se pudieron cargar los documentos observados.';
          this.loadingDocumentos = false;
        },
      });
  }

  seleccionarArchivo(event: Event, documento: DocumentoObservado): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const formatosPermitidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

    if (!formatosPermitidos.includes(file.type)) {
      this.errorCorreccion = 'Solo se permiten archivos PDF, JPG o PNG.';
      input.value = '';
      return;
    }

    const maxSizeMb = 5;
    const maxSizeBytes = maxSizeMb * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      this.errorCorreccion = `El archivo no debe superar los ${maxSizeMb}MB.`;
      input.value = '';
      return;
    }

    documento.archivoCorregido = file;
    documento.corregido = true;
    this.errorCorreccion = '';
  }

  todosTienenArchivo(): boolean {
    return (
      this.documentosObservados.length > 0 &&
      this.documentosObservados.every((doc) => !!doc.archivoCorregido)
    );
  }

  enviarCorreccion(): void {
    if (!this.idInstructorSubsanacion) {
      this.errorCorreccion = 'No se encontró el instructor asociado a la cuenta.';
      return;
    }

    if (!this.todosTienenArchivo()) {
      this.errorCorreccion = 'Debe subir un archivo corregido para cada documento observado.';
      return;
    }

    this.enviandoCorreccion = true;
    this.errorCorreccion = '';
    this.successCorreccion = '';

    this.subsanacionDocumentosService
      .enviarCorrecciones(this.idInstructorSubsanacion, this.documentosObservados)
      .subscribe({
        next: () => {
          this.enviandoCorreccion = false;
          this.successCorreccion =
            'Corrección enviada correctamente. Tu cuenta volverá a revisión.';

          setTimeout(() => {
            this.cerrarModalCorreccion();
            this.showSuccessModal = false;
            this.showErrorModal = false;
          }, 1800);
        },
        error: () => {
          this.enviandoCorreccion = false;
          this.errorCorreccion = 'No se pudo enviar la corrección. Intente nuevamente.';
        },
      });
  }

  cerrarModalCorreccion(): void {
    this.showDocumentosCorreccionModal = false;
    this.documentosObservados = [];
    this.loadingDocumentos = false;
    this.enviandoCorreccion = false;
    this.errorCorreccion = '';
    this.successCorreccion = '';
  }

  private mapAuthError(message: string): string {
    const normalized = (message || '').toLowerCase();
    if (/usuario inexistente|no existe|no encontrado/.test(normalized)) {
      return 'Usuario inexistente. Verifica tu correo o regístrate.';
    }
    if (/pendiente de validaci[oó]n|pendiente_validacion/.test(normalized)) {
      return 'Tu cuenta está pendiente de validación por el administrador.';
    }
    if (/subsanar|observaciones|pendiente_subsanacion/.test(normalized)) {
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
    this.errorTitle = 'Error de autenticación';

    this.authApiService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;

        if (!response.success || !response.usuario) {
          const msg = (response.message || '').toLowerCase();

          if (/subsanar|observaciones|pendiente_subsanacion/.test(msg)) {
            this.idInstructorPendiente = response.idInstructor ?? null;
            this.idInstructorSubsanacion = response.idInstructor ?? null;

            if (this.idInstructorPendiente) {
              this.obtenerDocumentosRechazados();
            } else {
              this.documentosRechazados = [
                'No se pudo obtener el detalle de los documentos observados.',
              ];
              this.showSubsanacionModal = true;
            }

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

        if (response.token) {
          localStorage.setItem(`authToken_${rol}`, response.token);
        }
        localStorage.setItem(`authUser_${rol}`, JSON.stringify(response.usuario));

        this.pendingRedirectUrl = `/${rol}/inicio`;
        this.successMessage = 'Bienvenido, Usuario';
        this.showSuccessModal = true;
      },
      error: (error) => {
        this.loading = false;
        const rawMessage = error?.error?.message ?? 'Error de conexión con el servidor';
        const normalized = rawMessage.toLowerCase();

        if (/subsanar|observaciones|pendiente_subsanacion/.test(normalized)) {
          const idInstructor = error?.error?.idInstructor ?? null;

          this.idInstructorPendiente = idInstructor;
          this.idInstructorSubsanacion = idInstructor;

          if (idInstructor) {
            this.obtenerDocumentosRechazados();
          } else {
            this.errorTitle = 'Documentos observados';
            this.errorMessage =
              'Tu cuenta tiene observaciones, pero no se recibió el ID del instructor.';
            this.showErrorModal = true;
          }

          return;
        }

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
