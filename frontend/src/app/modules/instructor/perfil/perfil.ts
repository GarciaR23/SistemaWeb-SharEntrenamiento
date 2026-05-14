import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormStateService } from '../../../services/form-state.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss'],
})
export class Perfil implements OnInit, OnDestroy {
  profileForm!: FormGroup;

  feedbackMessage = '';
  private subscription?: Subscription;

  constructor(
    public formState: FormStateService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      specialty: ['', Validators.required],
      rate: ['', Validators.required],
      selectedShift: ['Mañana', Validators.required],
      selectedDay: ['L', Validators.required],
      fromTime: ['08:00', Validators.required],
      toTime: ['17:00', Validators.required],
      bio: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.profileForm.patchValue(this.formState.state.profile);
    this.subscription = this.profileForm.valueChanges.subscribe((value) => {
      this.formState.state.profile = {
        ...this.formState.state.profile,
        fullName: value.fullName ?? '',
        specialty: value.specialty ?? '',
        rate: value.rate ?? '',
        selectedShift: value.selectedShift ?? 'Mañana',
        selectedDay: value.selectedDay ?? 'L',
        fromTime: value.fromTime ?? '08:00',
        toTime: value.toTime ?? '17:00',
        bio: value.bio ?? '',
        email: this.formState.state.profile.email,
        password: this.formState.state.profile.password,
      };

      console.log('Perfil reactivo:', this.formState.state.profile);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  selectDay(day: string) {
    this.profileForm.patchValue({ selectedDay: day });
    this.formState.state.profile.selectedDay = day;
    console.log('Día seleccionado:', day);
  }

  selectShift(shift: string) {
    this.profileForm.patchValue({ selectedShift: shift });
    this.formState.state.profile.selectedShift = shift;
    console.log('Turno seleccionado:', shift);
  }

  goToCertificado() {
    this.profileForm.markAllAsTouched();
    const missing = this.formState.getMissingProfileFields();

    if (missing.length > 0) {
      this.feedbackMessage = `Faltan completar: ${missing.join(', ')}`;
      console.warn(this.feedbackMessage);
      return;
    }

    this.feedbackMessage = '';
    console.log('Enviando perfil reactivo:', this.formState.state.profile);
    this.router.navigate(['/certificado']);
  }
}
