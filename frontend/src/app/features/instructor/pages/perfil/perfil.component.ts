import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { Subscription } from 'rxjs';

import { FormStateService } from '../../services/form-state.service';
import {
  Location,
  Ubication
} from '../../../../shared/services/location.service';
import { HeaderComponent } from '../../../../shared/components/header/landing-header/landing-header.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    HeaderComponent
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})

export class Perfil implements OnInit, OnDestroy {

  profileForm!: FormGroup;
  allDistricts: Ubication[] = [];
  private titleCase = new TitleCasePipe();

  feedbackMessage = '';
  timeValidationMessage = '';

  showValidationModal = false;
  validationMissingFields: string[] = [];

  private subscription?: Subscription;

  availableTimeSlots: string[] = [];

  distritosFallback: string[] = [
    'Ate',
    'Barranco',
    'Breña',
    'Callao',
    'Chorrillos',
    'Comas',
    'Jesús María',
    'La Molina',
    'La Victoria',
    'Lince',
    'Los Olivos',
    'Miraflores',
    'Pueblo Libre',
    'San Borja',
    'San Isidro',
    'San Juan de Lurigancho',
    'San Juan de Miraflores',
    'San Luis',
    'San Martín de Porres',
    'San Miguel',
    'Santa Anita',
    'Santiago de Surco',
    'Surquillo',
    'Villa El Salvador',
    'Villa María del Triunfo'
  ];

  private readonly fieldLabels: Record<string, string> = {
    fullName: 'Nombre completo',
    specialty: 'Especialidad',
    district: 'Distrito',
    address: 'Dirección',
    rate: 'Tarifa por hora',
    selectedShift: 'Horario disponible',
    selectedDay: 'Días disponibles',
    fromTime: 'Desde',
    toTime: 'Hasta',
    bio: 'Biografía profesional'
  };

  readonly availableDays = [
    { code: 'L', label: 'L' },
    { code: 'M', label: 'M' },
    { code: 'Mi', label: 'Mi' },
    { code: 'J', label: 'J' },
    { code: 'V', label: 'V' },
    { code: 'S', label: 'S' },
    { code: 'D', label: 'D' }
  ];

  readonly shiftHours: Record<string, string[]> = {
    Mañana: [
      '06:00',
      '07:00',
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00'
    ],

    Tarde: [
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00'
    ],

    Noche: [
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
      '23:00'
    ]
  };

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

      selectedShift: [[], this.arrayRequired],
      selectedDay: [['L'], this.arrayRequired],

      fromTime: ['', Validators.required],
      toTime: ['', Validators.required],

      bio: ['', Validators.required]
    });
  }

  toTitleCase(value: string): string {
    return this.titleCase.transform(value);
  }

  ngOnInit(): void {

    this.ubiService
      .getDistrictsByUbigeoPrefix('1401')
      .subscribe({
        next: (list: Ubication[]) => {
          if (list && list.length) {
            this.allDistricts = list.sort(
              (a: Ubication, b: Ubication) =>
                a.district.localeCompare(
                  b.district
                )
            );
          } else {
            this.setDistrictFallback();
          }
        },
        error: () => {
          this.setDistrictFallback();
        }
      });

    this.profileForm.patchValue(
      this.formState.state.profile
    );

    this.generateAvailableTimes();

    this.subscription =
      this.profileForm.valueChanges.subscribe(
        (value) => {

          this.formState.state.profile = {
            ...this.formState.state.profile,

            fullName:
              value.fullName ?? '',

            specialty:
              value.specialty ?? '',

            district:
              value.district ?? '',

            address:
              value.address ?? '',

            rate:
              value.rate ?? '',

            selectedShift:
              value.selectedShift ?? [],

            selectedDay:
              value.selectedDay ?? [],

            fromTime:
              value.fromTime ?? '',

            toTime:
              value.toTime ?? '',

            bio:
              value.bio ?? ''
          };

          this.validateTimeSelection();
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get selectedShift(): string[] {
    return (
      this.profileForm.value
        .selectedShift ?? []
    );
  }

  get selectedDay(): string[] {
    return (
      this.profileForm.value
        .selectedDay ?? []
    );
  }

  isShiftActive(
    shift: string
  ): boolean {
    return this.selectedShift.includes(
      shift
    );
  }

  isDayActive(
    day: string
  ): boolean {
    return this.selectedDay.includes(
      day
    );
  }

  get isContinueDisabled(): boolean {
    return (
      this.profileForm.invalid ||
      !this.selectedShift.length ||
      !this.selectedDay.length ||
      !!this.timeValidationMessage
    );
  }

  isInvalid(field: string): boolean {
    const control = this.profileForm.get(field);
    return !!control && control.invalid && control.touched;
  }

  fieldError(field: string): string | null {
    const control = this.profileForm.get(field);

    if (!control || !control.touched || !control.invalid) {
      return null;
    }

    if (control.hasError('required')) {
      return `${this.fieldLabels[field] ?? field} es obligatorio.`;
    }

    return null;
  }

  private arrayRequired(
    control: AbstractControl
  ): Record<string, boolean> | null {
    const value = control.value;
    return Array.isArray(value) && value.length
      ? null
      : { required: true };
  }

  fieldErrorLabel(field: string): string {
    return this.fieldLabels[field] ?? field;
  }

  toggleShift(
    shift: string
  ): void {

    const selected = [
      ...this.selectedShift
    ];

    const index =
      selected.indexOf(shift);

    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      selected.push(shift);
    }

    this.profileForm.patchValue({
      selectedShift: selected
    });

    this.generateAvailableTimes();
  }

  toggleDay(day: string): void {

    const selected = [
      ...this.selectedDay
    ];

    const index =
      selected.indexOf(day);

    if (index >= 0) {

      if (
        selected.length === 1
      ) {
        return;
      }

      selected.splice(index, 1);

    } else {

      selected.push(day);
    }

    this.profileForm.patchValue({
      selectedDay: selected
    });
  }

  generateAvailableTimes(): void {

    const times =
      new Set<string>();

    if (
      !this.selectedShift.length
    ) {

      this.availableTimeSlots =
        [];

      this.profileForm.patchValue({
        fromTime: '',
        toTime: ''
      });

      return;
    }

    this.selectedShift.forEach(
      (shift) => {
        const hours =
          this.shiftHours[shift];

        if (!hours) return;

        hours.forEach((hour) =>
          times.add(hour)
        );
      }
    );

    this.availableTimeSlots =
      Array.from(times).sort();

    const firstTime =
      this.availableTimeSlots[0] ?? '';

    const lastTime =
      this.availableTimeSlots[
      this.availableTimeSlots
        .length - 1
      ] ?? '';

    if (!this.availableTimeSlots.length) {
      this.profileForm.patchValue({
        fromTime: '',
        toTime: ''
      }, { emitEvent: false });

      this.formState.state.profile.fromTime = '';
      this.formState.state.profile.toTime = '';
      this.timeValidationMessage =
        'Selecciona una franja horaria.';

      return;
    }

    this.profileForm.patchValue({
      fromTime: firstTime,
      toTime: lastTime
    }, { emitEvent: false });

    this.formState.state.profile.fromTime = firstTime;
    this.formState.state.profile.toTime = lastTime;
    this.timeValidationMessage = '';
  }

  validateTimeSelection(): void {

    const fromTime =
      this.profileForm.value
        .fromTime;

    const toTime =
      this.profileForm.value
        .toTime;

    const messages: string[] =
      [];

    if (
      !this.selectedShift.length
    ) {

      this.timeValidationMessage =
        'Selecciona una franja horaria.';

      return;
    }

    if (
      fromTime &&
      this.availableTimeSlots.length &&
      !this.availableTimeSlots.includes(fromTime)
    ) {
      messages.push(
        'La hora de inicio no está disponible para la franja seleccionada.'
      );
    }

    if (
      toTime &&
      this.availableTimeSlots.length &&
      !this.availableTimeSlots.includes(toTime)
    ) {
      messages.push(
        'La hora de salida no está disponible para la franja seleccionada.'
      );
    }

    if (
      fromTime &&
      toTime &&
      fromTime >= toTime
    ) {
      messages.push(
        'La hora de inicio debe ser menor a la hora de salida.'
      );
    }

    this.timeValidationMessage =
      messages.join(' ');
  }

  formatHour(
    time: string
  ): string {

    const [hour] =
      time.split(':');

    const h = Number(hour);

    if (h === 0) {
      return '12:00 AM';
    }

    if (h < 12) {
      return `${h}:00 AM`;
    }

    if (h === 12) {
      return '12:00 PM';
    }

    return `${h - 12}:00 PM`;
  }

  goToCertificado(): void {
    this.profileForm.markAllAsTouched();

    if (this.timeValidationMessage) {
      this.validationMissingFields = [this.timeValidationMessage];
      this.showValidationModal = true;
      return;
    }

    if (this.profileForm.invalid) {
      return;
    }

    this.showValidationModal = false;
    this.router.navigate(['/certificado']);
  }

  goToCuentaFromPerfil(): void {
    this.profileForm.markAllAsTouched();

    const missingProfile = this.formState.getMissingProfileFields();
    const missingDocs = this.formState.getMissingDocumentFields();

    if (this.timeValidationMessage) {
      this.validationMissingFields = [this.timeValidationMessage];
      this.showValidationModal = true;
      return;
    }

    const missing = [...missingProfile, ...missingDocs];
    if (missing.length > 0) {
      this.validationMissingFields = missing;
      this.showValidationModal = true;
      return;
    }

    if (this.profileForm.invalid) {
      return;
    }

    this.router.navigate(['/cuenta']);
  }

  closeValidationModal(): void {
    this.showValidationModal =
      false;
  }

  private setDistrictFallback(): void {
    this.allDistricts = this.distritosFallback.map(
      (district) => ({ district, code: '' })
    );
  }

}
