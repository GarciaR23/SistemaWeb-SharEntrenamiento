import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
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

  feedbackMessage = '';
  private subscription?: Subscription;

  constructor(
    public formState: FormStateService,
    private fb: FormBuilder,
    private router: Router,
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

    const payload = this.formState.buildRegistrationPayload();
    console.log('Formulario completo listo para guardar:', payload);

    // Show modal and reset state
    this.showModal = true;
    this.formState.resetRegistration();
    this.accountForm.reset();
  }

  // Modal control
  showModal = false;

  closeModal(): void {
    this.showModal = false;
    this.feedbackMessage = '';
    this.router.navigate(['/login']);
  }
}
