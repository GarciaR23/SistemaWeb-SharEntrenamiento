import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormStateService } from '../../../services/form-state.service';
import { Location, Ubication } from '../../../services/location';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss'],
})
export class Perfil implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  allDistricts: Ubication[] = [];
  private titleCase = new TitleCasePipe();

  feedbackMessage = '';
  private subscription?: Subscription;

  constructor(
    public formState: FormStateService,
    private fb: FormBuilder,
    private router: Router,
    private ubiService: Location
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      specialty: ['', Validators.required],
      district: ['', Validators.required],
      address: ['', Validators.required],
      rate: ['', Validators.required],
      selectedShift: ['', Validators.required],
      selectedDay: ['L', Validators.required],
      fromTime: ['08:00', Validators.required],
      toTime: ['17:00', Validators.required],
      bio: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.ubiService.getDistrictsByUbigeoPrefix('1401').subscribe(list => {
      this.allDistricts = list.sort((a,b) => a.district.localeCompare(b.district));
    });
    this.profileForm.patchValue(this.formState.state.profile);

    this.subscription = this.profileForm.valueChanges.subscribe((value) => {
      this.formState.state.profile = {
        ...this.formState.state.profile,
        fullName: value.fullName ?? '',
        specialty: value.specialty ?? '',
        district: value.district ? this.titleCase.transform(value.district) : '',
        address: value.address ?? '',
        rate: value.rate ?? '',
        selectedShift: value.selectedShift ?? '',
        selectedDay: value.selectedDay ?? 'L',
        fromTime: value.fromTime ?? '08:00',
        toTime: value.toTime ?? '17:00',
        bio: value.bio ?? '',
        email: this.formState.state.profile.email,
        password: this.formState.state.profile.password,
      };
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

  onDistrictChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.formState.state.profile.district = value ? this.titleCase.transform(value) : '';
  }
}
