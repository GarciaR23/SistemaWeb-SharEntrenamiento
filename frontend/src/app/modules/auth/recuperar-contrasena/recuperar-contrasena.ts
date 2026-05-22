import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './recuperar-contrasena.html',
  styleUrls: ['./recuperar-contrasena.css'],
})
export class RecuperarContrasena {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  recoverForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  showModal = false;
  modalMessage = 'Se ha enviado un código a tu correo electrónico.';

  onSubmit() {
    if (this.recoverForm.valid) {
      console.log('Recuperar contraseña:', this.recoverForm.value);
      this.showModal = true;
      setTimeout(() => {
        this.showModal = false;
        this.router.navigate(['/token-contrasena']);
      }, 1400);
    }
  }
}
