import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '../../../core/services/auth-api.service';

@Component({
  selector: 'app-token-contrasena',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './token-contrasena.component.html',
  styleUrls: ['./token-contrasena.component.scss']
})
export class TokenContrasena implements OnDestroy {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authApiService = inject(AuthApiService);

  // Temporizador de reenvío
  countdown = 30;
  private intervalId: any;
  loading = false;
  errorMessage = '';

  tokenForm = this.fb.group({
    token1: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9a-zA-Z]$/)
      ]
    ],
    token2: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9a-zA-Z]$/)
      ]
    ],
    token3: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9a-zA-Z]$/)
      ]
    ],
    token4: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9a-zA-Z]$/)
      ]
    ]
  });

  constructor() {
    this.startCountdown();
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    const value = input.value
      .replace(/[^0-9a-zA-Z]/g, '')
      .slice(0, 1);

    input.value = value;

    this.tokenForm.patchValue({
      [`token${index + 1}`]: value
    });

    const form = input.closest('form');
    const inputs =
      form?.querySelectorAll<HTMLInputElement>(
        '.code-box input'
      ) ?? [];

    // Ir al siguiente input
    if (value && index < inputs.length - 1) {
      inputs[index + 1]?.focus();
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    // Retroceder con backspace
    if (
      event.key === 'Backspace' &&
      !input.value &&
      index > 0
    ) {
      const form = input.closest('form');
      const inputs =
        form?.querySelectorAll<HTMLInputElement>(
          '.code-box input'
        ) ?? [];

      inputs[index - 1]?.focus();
    }
  }

  onSubmit(): void {
    if (this.tokenForm.invalid || this.loading) {
      this.tokenForm.markAllAsTouched();
      return;
    }

    const email = localStorage.getItem('recoveryEmail') ?? '';
    if (!email) {
      this.errorMessage = 'Sesión de recuperación expirada. Vuelve a solicitar un token.';
      return;
    }

    const token = Object.values(this.tokenForm.getRawValue()).join('');
    this.loading = true;
    this.errorMessage = '';

    this.authApiService.verifyRecoveryToken(email, token).subscribe({
      next: () => {
        this.loading = false;
        localStorage.setItem('recoveryToken', token);
        this.router.navigate(['/restaurar-contrasena']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message ?? 'Token inválido o expirado';
      },
    });
  }

  startCountdown(): void {
    this.countdown = 30;

    clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  resendCode(): void {
    const email = localStorage.getItem('recoveryEmail') ?? '';
    if (!email || this.loading || this.countdown > 0) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authApiService.forgotPassword(email).subscribe({
      next: () => {
        this.loading = false;
        this.startCountdown();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message ?? 'No se pudo reenviar el token';
      },
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}

