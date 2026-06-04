import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormStateService } from '../../../services/form-state.service';
import { RegistrationApiService } from '../../../services/registration-api.service';
import { HeaderComponent } from "../../../layouts/header/header.component";

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive, HeaderComponent],
  templateUrl: './cuenta.html',
  styleUrls: ['./cuenta.scss'],
})
export class Cuenta implements OnInit, OnDestroy {
  accountForm!: FormGroup;
  showPassword = false;
  profileImagePreview = '';

  feedbackMessage = '';
  loading = false;
  showModal = false;
  modalType: 'success' | 'error' | null = null;
  modalTitle = '';
  modalMessage = '';
  missingFields: string[] = [];

  private subscription?: Subscription;

  constructor(
    public formState: FormStateService,
    private fb: FormBuilder,
    private router: Router,
    private registrationApiService: RegistrationApiService,
  ) {
    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
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

    // Nombre de Archivo
    const existing = this.formState.state.profile.profileImageFile;
    if (existing) {
      this.profileImagePreview = existing.name;
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  SeleccionarImagenPerfil(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.formState.state.profile.profileImageFile = file;
    this.profileImagePreview = file ? file.name : '';
  }

  async finalizarRegistro(): Promise<void> {
    this.accountForm.markAllAsTouched();

    this.missingFields = this.formState.getMissingRegistrationFields();
    if (this.missingFields.length > 0) {
      this.modalType = 'error';
      this.modalTitle = 'Faltan campos por completar';
      this.modalMessage = 'Corrige los siguientes datos para continuar con tu registro:';
      this.showModal = true;
      return;
    }

    const ok = window.confirm('¿Confirmas que deseas enviar el formulario de registro?');
    if (!ok) {
      return;
    }

    this.loading = true;
    this.feedbackMessage = '';

    try {
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
      });

      this.modalType = 'success';
      this.modalTitle = 'Solicitud exitosa';
      this.modalMessage = 'Tu solicitud se ha enviado correctamente. Espera de 48 a 72 horas hábiles para la activación de la cuenta por comprobación de documentos.';
      this.showModal = true;
      this.formState.resetRegistration();
      this.accountForm.reset();
      this.profileImagePreview = '';
    } catch (error: any) {
      this.modalType = 'error';
      this.modalTitle = 'Error de conexión o servidor';

      if (error instanceof HttpErrorResponse) {
        console.error('HTTP Error al enviar registro:', error);
        const detailMessage = error.error?.detail ?? error.error?.message ?? error.message;
        this.modalMessage = `Error ${error.status} en ${error.url}: ${detailMessage}`;
      } else {
        console.error('Error inesperado al enviar registro:', error);
        this.modalMessage = error?.message ?? 'Hubo un problema al enviar tu solicitud. Intenta nuevamente más tarde.';
      }

      this.showModal = true;
    } finally {
      this.loading = false;
    }
  }

  closeModal(): void {
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