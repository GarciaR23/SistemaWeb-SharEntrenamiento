import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormStateService } from '../../../services/form-state.service';
import { DayCode, ShiftName, ShiftSchedule } from '../../../data/registration.models';
import { Location, Ubication } from '../../../services/location';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss'],
})
export class Perfil implements OnInit, OnDestroy {
  readonly shifts: ShiftName[] = ['Mañana', 'Tarde', 'Noche'];
  readonly days: DayCode[] = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];

  readonly shiftWindows: Record<ShiftName, { from: string; to: string; label: string }> = {
    'Mañana': { from: '06:00', to: '12:00', label: '6:00 a.m. - 12:00 p.m.' },
    'Tarde': { from: '12:00', to: '19:00', label: '12:00 p.m. - 7:00 p.m.' },
    'Noche': { from: '19:00', to: '23:59', label: '7:00 p.m. - 12:00 a.m.' },
  };

  profileForm!: FormGroup;
  allDistricts: Ubication[] = [];

  feedbackMessage = '';
  modalMessage = '';
  showModal = false;
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
      fromTime: ['', Validators.required],
      toTime: ['', Validators.required],
      selectedShifts: [[] as ShiftName[], Validators.required],
      selectedDays: [[] as DayCode[], Validators.required],
      shiftSchedules: [[] as ShiftSchedule[], Validators.required],
      bio: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.ubiService.getDistrictsByUbigeoPrefix('1401').subscribe(list => {
      this.allDistricts = list.sort((a,b) => a.district.localeCompare(b.district));
    });
    this.profileForm.patchValue({
      ...this.formState.state.profile,
      fromTime: this.formState.state.profile.fromTime,
      toTime: this.formState.state.profile.toTime,
      selectedShifts: [...this.formState.state.profile.selectedShifts],
      selectedDays: [...this.formState.state.profile.selectedDays],
      shiftSchedules: [...this.formState.state.profile.shiftSchedules],
    });

    this.subscription = this.profileForm.valueChanges.subscribe((value) => {
      this.formState.state.profile = {
        ...this.formState.state.profile,
        fullName: value.fullName ?? '',
        specialty: value.specialty ?? '',
        district: value.district ?? '',
        address: value.address ?? '',
        rate: value.rate ?? '',
        selectedShifts: value.selectedShifts ?? [],
        selectedDays: value.selectedDays ?? [],
        bio: value.bio ?? '',
        email: this.formState.state.profile.email,
        password: this.formState.state.profile.password,
      };
      this.formState.updateScheduleSummary();
    });
  }

  private updateCombinedTimeRange(): void {
    const shifts = this.selectedShifts;

    if (!shifts.length) {
      this.profileForm.patchValue({
        fromTime: '',
        toTime: '',
      }, { emitEvent: false });
      return;
    }

    let min = Infinity;
    let max = -Infinity;

    for (const shift of shifts) {
      const window = this.shiftWindows[shift];

      const [h1, m1] = window.from.split(':').map(Number);
      const [h2, m2] = window.to.split(':').map(Number);

      const start = h1 * 60 + m1;
      const end = h2 * 60 + m2;

      min = Math.min(min, start);
      max = Math.max(max, end);
    }

    const format = (mins: number) => {
      const h = Math.floor(mins / 60).toString().padStart(2, '0');
      const m = (mins % 60).toString().padStart(2, '0');
      return `${h}:${m}`;
    };

    this.profileForm.patchValue({
      fromTime: format(min),
      toTime: format(max),
    }, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  isDaySelected(day: DayCode): boolean {
    const selectedDays = this.profileForm.value.selectedDays as DayCode[];
    return selectedDays.includes(day);
  }

  toggleDay(day: DayCode): void {
    const selectedDays = [...((this.profileForm.value.selectedDays as DayCode[]) ?? [])];
    const index = selectedDays.indexOf(day);

    if (index >= 0) {
      selectedDays.splice(index, 1);
    } else {
      selectedDays.push(day);
    }

    this.profileForm.patchValue({ selectedDays });
    this.formState.updateShiftSelection(this.selectedShifts, selectedDays);
  }

  isShiftSelected(shift: ShiftName): boolean {
    return this.selectedShifts.includes(shift);
  }

  toggleShift(shift: ShiftName): void {
    let selectedShifts = [...this.selectedShifts];
    let schedules = [...this.shiftSchedules];

    const index = selectedShifts.indexOf(shift);

    if (index >= 0) {
      selectedShifts.splice(index, 1);
      schedules = schedules.filter(s => s.shift !== shift);
    } else {
      selectedShifts.push(shift);

      const window = this.shiftWindows[shift];

      schedules.push({
        shift,
        fromTime: window.from,
        toTime: window.to,
      });

      this.openModal(`Rango permitido de ${shift}: ${window.label}`);
    }

    this.profileForm.patchValue({
      selectedShifts,
      shiftSchedules: schedules,
    }, { emitEvent: false });

    this.updateCombinedTimeRange();

    this.formState.state.profile = {
      ...this.formState.state.profile,
      selectedShifts,
      shiftSchedules: schedules,
      fromTime: this.profileForm.value.fromTime ?? '',
      toTime: this.profileForm.value.toTime ?? '',
    };

    this.formState.updateScheduleSummary();
  }

  onPreferredTimeChange(): void {
    this.formState.updateScheduleSummary();
  }

  getShiftWindow(shift: ShiftName): { from: string; to: string; label: string } {
    return this.shiftWindows[shift];
  }

  get selectedShifts(): ShiftName[] {
    return (this.profileForm.value.selectedShifts as ShiftName[]) ?? [];
  }

  get selectedDays(): DayCode[] {
    return (this.profileForm.value.selectedDays as DayCode[]) ?? [];
  }

  get shiftSchedules(): ShiftSchedule[] {
    return (this.profileForm.value.shiftSchedules as ShiftSchedule[]) ?? [];
  }

  private validateSchedules(): string[] {
    const errors: string[] = [];

    if (!this.selectedShifts.length) {
      errors.push('Selecciona al menos un turno');
    }

    if (!this.selectedDays.length) {
      errors.push('Selecciona al menos un día disponible');
    }

    const fromTime = this.profileForm.value.fromTime as string;
    const toTime = this.profileForm.value.toTime as string;

    const range = `${fromTime || '--:--'} - ${toTime || '--:--'}`;

    if (!fromTime?.trim() || !toTime?.trim()) {
      errors.push(`El horario establecido es requerido: ${range}`);
      return errors;
    }

    const toMinutes = (value: string): number => {
      const [h, m] = value.split(':').map(Number);
      return (h * 60) + m;
    };

    const start = toMinutes(fromTime);
    const end = toMinutes(toTime);

    if (start >= end) {
      errors.push('La hora de inicio debe ser menor a la hora fin');
      return errors;
    }

    // Calculamos los límites globales permitidos sumando los bloques de los turnos seleccionados
    let absoluteMin = Infinity;
    let absoluteMax = -Infinity;
    let activeShiftsLabels: string[] = [];

    for (const shift of this.selectedShifts) {
      const window = this.shiftWindows[shift];
      absoluteMin = Math.min(absoluteMin, toMinutes(window.from));
      absoluteMax = Math.max(absoluteMax, toMinutes(window.to));
      activeShiftsLabels.push(`${shift} (${window.label})`);
    }

    // Validamos que el rango final elegido por el usuario no se desborde de sus turnos activos
    if (start < absoluteMin || end > absoluteMax) {
      errors.push(`El horario seleccionado (${range}) debe estar dentro de los límites de tus turnos: ${activeShiftsLabels.join(', ')}`);
    }

    return errors;
  }

  goToCertificado() {
    this.profileForm.markAllAsTouched();

    // Validamos directamente contra la validez del Formulario Reactivo
    const missing: string[] = [];
    if (this.profileForm.controls['fullName'].invalid) missing.push('Nombre Completo');
    if (this.profileForm.controls['specialty'].invalid) missing.push('Especialidad');
    if (this.profileForm.controls['district'].invalid) missing.push('Distrito');
    if (this.profileForm.controls['address'].invalid) missing.push('Dirección');
    if (this.profileForm.controls['rate'].invalid) missing.push('Tarifa por hora');
    if (this.profileForm.controls['bio'].invalid) missing.push('Biografía profesional');

    const scheduleErrors = this.validateSchedules();

    if (missing.length > 0 || scheduleErrors.length > 0) {
      const allErrors = [...missing, ...scheduleErrors];
      this.feedbackMessage = `Faltan completar/corregir: ${allErrors.join(', ')}`;
      this.openModal(this.feedbackMessage);
      console.warn(this.feedbackMessage);
      return;
    }

    this.feedbackMessage = '';
    console.log('Enviando perfil reactivo:', this.formState.state.profile);
    this.router.navigate(['/certificado']);
  }

  openModal(message: string): void {
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalMessage = '';
  }

  onDistrictChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const code = target.value;
  }

  formatAmPm(value: string | null | undefined): string {
    if (!value) return '';
    const parts = value.split(':').map(Number);
    if (parts.length < 1 || Number.isNaN(parts[0])) return '';
    const hour = parts[0];
    return hour >= 12 ? 'PM' : 'AM';
  }

  get fromAmPm(): string {
    return this.formatAmPm(this.profileForm.value.fromTime as string);
  }

  get toAmPm(): string {
    return this.formatAmPm(this.profileForm.value.toTime as string);
  }
}
