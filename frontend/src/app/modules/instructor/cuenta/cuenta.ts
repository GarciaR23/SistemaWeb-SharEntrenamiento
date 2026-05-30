import { CommonModule } from '@angular/common';
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
    this.accountForm.patchValue(this.formState.state.profile);
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

    const missing = this.formState.getMissingRegistrationFields();
    if (missing.length > 0) {
      this.feedbackMessage = `Faltan completar: ${missing.join(', ')}`;
      console.warn(this.feedbackMessage);
      return;
    }

    //confirmacion antes de enviar
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

      this.showModal = true;
      this.formState.resetRegistration();
      this.accountForm.reset();
    } catch (error: any) {
      this.feedbackMessage = error?.error?.message ?? error?.message ?? 'No se pudo completar el registro';
    } finally {
      this.loading = false;
    }
  }

  // Modal control
  showModal = false;

  closeModal(): void {
    this.showModal = false;
    this.feedbackMessage = '';
    this.router.navigate(['/login']);
  }
}
