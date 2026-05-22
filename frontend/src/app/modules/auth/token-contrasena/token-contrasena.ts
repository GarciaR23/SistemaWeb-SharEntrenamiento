import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-token-contrasena',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './token-contrasena.html',
  styleUrls: ['./token-contrasena.css']
})
export class TokenContrasena implements OnDestroy {

  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Temporizador de reenvío
  countdown = 30;
  private intervalId: any;

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
    if (this.tokenForm.valid) {

      const token = Object.values(
        this.tokenForm.getRawValue()
      ).join('');

      console.log('Token:', token);

      this.router.navigate([
        '/restaurar-contrasena'
      ]);

    } else {
      this.tokenForm.markAllAsTouched();
    }
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
    console.log('Reenviando token...');

    // Aquí luego conectas el backend
    // this.authService.resendToken()

    this.startCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}