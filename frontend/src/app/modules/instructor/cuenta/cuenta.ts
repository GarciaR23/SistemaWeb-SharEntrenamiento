import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth';
import { DayCode } from '../../../data/registration.models';
import { FormStateService } from '../../../services/form-state.service';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './cuenta.html',
  styleUrls: ['./cuenta.scss'],
})
export class Cuenta implements OnInit, OnDestroy {
  accountForm!: FormGroup;
  showPassword = false;
  isSubmitting = false;
  photoFileName = '';

  feedbackMessage = '';
  private subscription?: Subscription;

  constructor(
    public formState: FormStateService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
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

      console.log('Cuenta reactiva:', {
        email: this.formState.state.profile.email,
        password: this.formState.state.profile.password,
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onPhotoChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] ?? null;
    this.photoFileName = file?.name ?? '';
  }

  dayLabel(day: DayCode): string {
    const labels: Record<DayCode, string> = {
      L: 'Lunes',
      M: 'Martes',
      Mi: 'Miércoles',
      J: 'Jueves',
      V: 'Viernes',
      S: 'Sábado',
      D: 'Domingo',
    };

    return labels[day] ?? day;
  }

  formatTime12h(value: string): string {
    if (!value) {
      return '--:--';
    }

    const [hourText, minuteText] = value.split(':');
    const hour = Number(hourText);
    const minutes = minuteText ?? '00';

    if (Number.isNaN(hour)) {
      return '--:--';
    }

    const suffix = hour >= 12 ? 'PM' : 'AM';
    const normalizedHour = hour % 12 || 12;

    return `${normalizedHour.toString().padStart(2, '0')}:${minutes} ${suffix}`;
  }

  finalizarRegistro(): void {
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

    this.isSubmitting = true;

    this.authService.register({
      email: this.formState.state.profile.email,
      password: this.formState.state.profile.password,
      rol: 'instructor',
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showModal = true;
      },
      error: (error) => {
        this.isSubmitting = false;
        const backendMessage = error?.error?.message;
        this.feedbackMessage = backendMessage || 'No se pudo completar el registro. Intenta nuevamente.';
      },
    });
  }

  // Modal control
  showModal = false;

  closeModal(): void {
    this.showModal = false;
    this.feedbackMessage = '';
    this.formState.resetRegistration();
    this.accountForm.reset();
    this.router.navigate(['/login']);
  }
}
