import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormStateService } from '../../services/form-state.service';
import { RegistrationApiService } from '../../../auth/services/registration-api.service';
import { HeaderComponent } from '../../../../shared/components/header/landing-header/landing-header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive, HeaderComponent, FooterComponent],
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss'],
})
export class Cuenta implements OnInit, OnDestroy {
  accountForm!: FormGroup;
  showPassword = false;
  profileImagePreview = '';
  profileImagePreviewUrl = '';

  feedbackMessage = '';
  loading = false;
  showModal = false;
  modalType: 'success' | 'error' | null = null;
  modalTitle = '';
  modalMessage = '';
  missingFields: string[] = [];
  passwordStrength = 0;
  passwordStrengthLabel = 'Sin contraseña';
  passwordStrengthClass = 'weak';
  emailFeedbackMessage = '';

  private subscription?: Subscription;
  private autoCloseTimer?: ReturnType<typeof setTimeout>;
  private readonly emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  private readonly passwordPattern = /^[A-Za-z0-9!@#$%^&*()_+\-=?.,:]+$/;

  constructor(
    public formState: FormStateService,
    private fb: FormBuilder,
    private router: Router,
    private registrationApiService: RegistrationApiService,
  ) {
    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
    });
  }

  ngOnInit(): void {
    const email = this.formState.state.profile.email ?? '';
    if (email) {
      this.accountForm.patchValue({ email });
    }
    this.subscription = this.accountForm.valueChanges.subscribe((value) => {
      this.formState.state.profile = {
        ...this.formState.state.profile,
        email: value.email ?? '',
        password: value.password ?? '',
      };
    });

    const existing = this.formState.state.profile.profileImageFile;
    if (existing) {
      this.profileImagePreview = existing.name;
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = undefined;
    }
    if (this.profileImagePreviewUrl) {
      URL.revokeObjectURL(this.profileImagePreviewUrl);
    }
  }

  get disponibilidadResumen(): string {
    const h = this.formState.state.profile.horarios;
    if (!h || h.length === 0) return 'No especificado';
    return h.map(d => `${d.dia} (${d.turno}) ${d.inicio} - ${d.fin}`).join(' | ');
  }

  get emailHasError(): boolean {
    const control = this.accountForm.get('email');
    return !!control && control.touched && control.invalid;
  }

  get passwordHasError(): boolean {
    const control = this.accountForm.get('password');
    return !!control && control.touched && control.invalid;
  }

  sanitizeEmailValue(value: string): string {
    return value.replace(/[\s\t\r\n\u0000-\u001F\u007F]/g, '').trim();
  }

  sanitizePasswordValue(value: string): string {
    return value.replace(/[\s\t\r\n\u0000-\u001F\u007F]/g, '').trim();
  }

  onEmailInput(value: string): void {
    const sanitized = this.sanitizeEmailValue(value);
    this.accountForm.get('email')?.setValue(sanitized, { emitEvent: false });
    this.emailFeedbackMessage = !sanitized ? 'El correo es obligatorio.' : (this.emailPattern.test(sanitized) ? '' : 'Debe seguir el formato ejemplo@dominio.com');
  }

  onPasswordInput(value: string): void {
    const sanitized = this.sanitizePasswordValue(value).slice(0, 10);
    this.accountForm.get('password')?.setValue(sanitized, { emitEvent: false });
    this.updatePasswordStrength();
  }

  updatePasswordStrength(): void {
    const value = this.accountForm.get('password')?.value ?? '';
    let score = 0;
    if (value.length >= 8) score += 1;
    if (value.length >= 10) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[a-z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (this.passwordPattern.test(value)) score += 1;

    this.passwordStrength = Math.min(score, 6);
    if (!value) {
      this.passwordStrengthLabel = 'Sin contraseña';
      this.passwordStrengthClass = 'weak';
      return;
    }

    if (this.passwordStrength <= 2) {
      this.passwordStrengthLabel = 'Débil';
      this.passwordStrengthClass = 'weak';
    } else if (this.passwordStrength <= 4) {
      this.passwordStrengthLabel = 'Media';
      this.passwordStrengthClass = 'medium';
    } else {
      this.passwordStrengthLabel = 'Fuerte';
      this.passwordStrengthClass = 'strong';
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  SeleccionarImagenPerfil(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (this.profileImagePreviewUrl) {
      URL.revokeObjectURL(this.profileImagePreviewUrl);
    }
    this.formState.state.profile.profileImageFile = file;
    this.profileImagePreview = file ? file.name : '';
    this.profileImagePreviewUrl = file ? URL.createObjectURL(file) : '';
  }

  private normalizarTurno(turno: string): string {
    switch (turno) {
      case 'Mañana': return 'mañana';
      case 'Tarde': return 'tarde';
      case 'Noche': return 'noche';
      default: return turno.toLowerCase();
    }
  }

  async finalizarRegistro(): Promise<void> {
    this.accountForm.markAllAsTouched();
    this.emailFeedbackMessage = !this.accountForm.get('email')?.value ? 'El correo es obligatorio.' : (this.emailPattern.test(this.accountForm.get('email')?.value) ? '' : 'Debe seguir el formato ejemplo@dominio.com');
    this.updatePasswordStrength();

    this.missingFields = this.formState.getMissingAccountFields();
    if (this.accountForm.get('email')?.invalid) this.missingFields.push('Correo electrónico');
    if (this.accountForm.get('password')?.invalid) this.missingFields.push('Contraseña');

    if (this.missingFields.length > 0) {
      this.modalType = 'error';
      this.modalTitle = 'Completa el paso 3';
      this.modalMessage = 'Corrige los siguientes datos del paso 3 para finalizar tu registro:';
      this.showModal = true;
      return;
    }

    this.loading = true;
    this.feedbackMessage = '';

    try {
      const horarios = (this.formState.state.profile.horarios || []).map(h => ({
        diaSemana: h.dia,
        horarioPreferencia: this.normalizarTurno(h.turno),
        horarioInicio: h.inicio,
        horarioFinal: h.fin,
      }));

      await this.registrationApiService.registrarInstructorConDocumentos({
        nombreCompleto: this.formState.state.profile.fullName,
        especialidad: this.formState.state.profile.specialty,
        biografia: this.formState.state.profile.bio,
        distrito: this.formState.state.profile.district,
        direccion: this.formState.state.profile.address,
        profileImageFile: this.formState.state.profile.profileImageFile ?? null,
        email: this.formState.state.profile.email,
        clave: this.formState.state.profile.password,
        documentos: {
          certificacion: this.formState.state.documents.certificacion.file,
          dni: this.formState.state.documents.dni.file,
          titulo: this.formState.state.documents.titulo.file,
          antecedentes: this.formState.state.documents.antecedentes.file,
        },
        tarifaHora: Number(this.formState.state.profile.rate),
        horarios: horarios,
      });

      this.modalType = 'success';
      this.modalTitle = 'Solicitud exitosa';
      this.modalMessage = 'Tu solicitud se ha enviado correctamente. Espera de 48 a 72 horas hábiles para la activación de la cuenta por comprobación de documentos.';
      this.showModal = true;
      this.formState.resetRegistration();
      this.accountForm.reset();
      this.profileImagePreview = '';
      this.profileImagePreviewUrl = '';
      this.startAutoClose();
    } catch (error: any) {
      this.modalType = 'error';
      this.modalTitle = 'Error de conexión o servidor';
      if (error instanceof HttpErrorResponse) {
        const detailMessage = error.error?.detail ?? error.error?.message ?? error.message;
        this.modalMessage = `Error ${error.status} en ${error.url}: ${detailMessage}`;
      } else {
        this.modalMessage = error?.message ?? 'Hubo un problema al enviar tu solicitud. Intenta nuevamente más tarde.';
      }
      this.showModal = true;
    } finally {
      this.loading = false;
    }
  }

  private startAutoClose(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
    this.autoCloseTimer = window.setTimeout(() => {
      this.closeModal();
    }, 3000);
  }

  closeModal(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = undefined;
    }

    const goToLogin = this.modalType === 'success';
    this.showModal = false;
    this.modalType = null;
    this.modalTitle = '';
    this.modalMessage = '';
    this.missingFields = [];
    this.feedbackMessage = '';
    if (goToLogin) {
      this.router.navigate(['/login']);
    }
  }
}