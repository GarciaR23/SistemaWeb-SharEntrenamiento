import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, CommonModule],
  templateUrl: './restaurar-contrasena.html',
  styleUrls: ['./restaurar-contrasena.css'],
})
export class RestaurarContrasena {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  restoreForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validators: matchPasswords('password', 'confirmPassword') });

  showPassword = false;
  showConfirmPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.restoreForm.valid) {
      console.log('Restaurar contraseña:', this.restoreForm.value);
      this.router.navigate(['/login']);
    }
  }
}
