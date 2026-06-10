import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { AuthApiService } from '../../../core/services/auth-api.service';
import { HeaderComponent } from "../../../shared/components/header/header.component";

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, CommonModule, RouterLink, HeaderComponent],
  templateUrl: './recuperar-contrasena.html',
  styleUrls: ['./recuperar-contrasena.scss'],
})
export class RecuperarContrasena {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authApiService = inject(AuthApiService);

  recoverForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  showModal = false;
  modalMessage = 'Se ha enviado un código a tu correo electrónico.';
  errorMessage = '';
  loading = false;

  onSubmit() {
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
