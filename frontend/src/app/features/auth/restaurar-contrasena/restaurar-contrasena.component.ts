import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthApiService } from '../../../core/services/auth-api.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';

function matchPasswords(controlName: string, confirmName: string) {
  return (formGroup: any) => {
    const control = formGroup.controls[controlName];
    const confirm = formGroup.controls[confirmName];

    if (confirm.errors && !confirm.errors.passwordMismatch) {
      return;
    }

    if (control.value !== confirm.value) {
      confirm.setErrors({ passwordMismatch: true });
    } else {
      confirm.setErrors(null);
    }
  };
}

@Component({
  selector: 'app-restaurar-contrasena',
  standalone: true,
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, CommonModule, HeaderComponent],
  templateUrl: './restaurar-contrasena.component.html',
  styleUrls: ['./restaurar-contrasena.component.scss'],
})
export class RestaurarContrasena {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authApiService = inject(AuthApiService);

  restoreForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validators: matchPasswords('password', 'confirmPassword') });

  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  errorMessage = '';

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.restoreForm.invalid || this.loading) {
      this.restoreForm.markAllAsTouched();
      return;
    }

    const email = localStorage.getItem('recoveryEmail') ?? '';
    const token = localStorage.getItem('recoveryToken') ?? '';
    const password = this.restoreForm.value.password ?? '';

    if (!email || !token) {
      this.errorMessage = 'Sesión de recuperación expirada. Solicita un nuevo token.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authApiService.resetPassword(email, token, password).subscribe({
      next: () => {
        this.loading = false;
        localStorage.removeItem('recoveryEmail');
        localStorage.removeItem('recoveryToken');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message ?? 'No se pudo restablecer la contraseña';
      },
    });
  }
}

