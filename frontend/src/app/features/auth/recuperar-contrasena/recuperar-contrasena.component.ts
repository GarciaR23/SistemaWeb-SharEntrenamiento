import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { AuthApiService } from '../../../core/services/auth-api.service';
import { HeaderComponent } from '../../../shared/components/header/landing-header/landing-header.component';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, RouterLink, HeaderComponent],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss'],
})
export class RecuperarContrasena {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authApiService = inject(AuthApiService);

  private readonly emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

  private readonly emailValidator = (control: AbstractControl): ValidationErrors | null => {
    const rawValue = (control.value ?? '').toString();
    const trimmedValue = rawValue.trim();

    if (trimmedValue.length === 0) {
      return rawValue.length === 0 ? { required: true } : { whitespaceOnly: true };
    }

    if (/[\s\t\r\n\u0000-\u001F\u007F]/.test(rawValue)) {
      return { invalidCharacters: true };
    }

    if (!this.emailPattern.test(trimmedValue)) {
      return { invalidFormat: true };
    }

    return null;
  };

  recoverForm = this.fb.group({
    email: ['', [Validators.required, this.emailValidator]],
  });

  showModal = false;
  modalMessage = 'Se ha enviado un código a tu correo electrónico.';
  errorMessage = '';
  loading = false;
  submitted = false;

  shouldShowEmailError(): boolean {
    const control = this.recoverForm.get('email');
    return !!(control?.touched || control?.dirty || this.submitted);
  }

  getEmailErrorMessage(): string {
    const control = this.recoverForm.get('email');
    if (!this.shouldShowEmailError() || !control?.invalid) {
      return '';
    }

    if (control.hasError('required') || control.hasError('whitespaceOnly')) {
      return 'El correo electrónico es obligatorio.';
    }

    if (control.hasError('invalidCharacters')) {
      return 'No se permiten espacios, tabulaciones, saltos de línea ni caracteres invisibles.';
    }

    return 'Ingresa un correo electrónico válido.';
  }

  sanitizeEmailValue(): void {
    const control = this.recoverForm.get('email');
    const rawValue = (control?.value ?? '').toString();
    const sanitizedValue = rawValue.replace(/[\s\t\r\n\u0000-\u001F\u007F]/g, '');

    if (rawValue !== sanitizedValue) {
      control?.setValue(sanitizedValue, { emitEvent: false });
    }
  }

  onSubmit() {
    this.submitted = true;
    this.sanitizeEmailValue();

    if (this.recoverForm.invalid || this.loading) {
      this.recoverForm.markAllAsTouched();
      return;
    }

    const email = this.recoverForm.value.email ?? '';
    this.loading = true;
    this.errorMessage = '';

    this.authApiService.forgotPassword(email).subscribe({
      next: () => {
        this.loading = false;
        localStorage.setItem('recoveryEmail', email);
        this.showModal = true;
        setTimeout(() => {
          this.showModal = false;
          this.router.navigate(['/token-contrasena']);
        }, 1400);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message ?? 'No se pudo enviar el token';
      },
    });
  }
}
