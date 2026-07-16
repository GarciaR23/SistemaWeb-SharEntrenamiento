import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormStateService } from '../../services/form-state.service';
import { Location, Ubication } from '../../../../shared/services/location.service';
import { HeaderComponent } from '../../../../shared/components/header/landing-header/landing-header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, RouterLinkActive, HeaderComponent, FooterComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class Perfil implements OnInit, OnDestroy {

  profileForm!: FormGroup;
  allDistricts: Ubication[] = [];
  private titleCase = new TitleCasePipe();

  showValidationModal = false;
  validationMissingFields: string[] = [];
  errorHorario: string = '';
  private subscription?: Subscription;

  readonly bioMaxLength = 500;

  distritosFallback: string[] = [
    'Ate', 'Barranco', 'Breña', 'Callao', 'Chorrillos', 'Comas',
    'Jesús María', 'La Molina', 'La Victoria', 'Lince', 'Los Olivos',
    'Miraflores', 'Pueblo Libre', 'San Borja', 'San Isidro',
    'San Juan de Lurigancho', 'San Juan de Miraflores', 'San Luis',
    'San Martín de Porres', 'San Miguel', 'Santa Anita',
    'Santiago de Surco', 'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo'
  ];

  private readonly fieldLabels: Record<string, string> = {
    fullName: 'Nombre completo', specialty: 'Especialidad', district: 'Distrito',
    address: 'Dirección', rate: 'Tarifa por hora', selectedShift: 'Horario disponible',
    selectedDay: 'Días disponibles', bio: 'Biografía profesional'
  };

  readonly availableDays = [
    { code: 'L', label: 'L' }, { code: 'M', label: 'M' }, { code: 'Mi', label: 'Mi' },
    { code: 'J', label: 'J' }, { code: 'V', label: 'V' }, { code: 'S', label: 'S' }, { code: 'D', label: 'D' }
  ];

  readonly shiftHours: Record<string, string[]> = {
    Mañana: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00'],
    Tarde: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    Noche: ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
  };

  private readonly ordenDias: Record<string, number> = {
    'L': 1, 'M': 2, 'Mi': 3, 'J': 4, 'V': 5, 'S': 6, 'D': 7
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
      selectedDay: [[], this.arrayRequired],
      bio: ['', Validators.required]
    });
  }

  toTitleCase(value: string): string { return this.titleCase.transform(value); }

  ngOnInit(): void {
    this.ubiService.getDistrictsByUbigeoPrefix('1401').subscribe({
      next: (list: Ubication[]) => {
        if (list?.length) this.allDistricts = list.sort((a, b) => a.district.localeCompare(b.district));
        else this.setDistrictFallback();
      },
      error: () => this.setDistrictFallback()
    });
    this.profileForm.patchValue(this.formState.state.profile);
    this.sincronizarHorariosConDias();
    this.subscription = this.profileForm.valueChanges.subscribe(value => {
      this.formState.state.profile = {
        ...this.formState.state.profile,
        fullName: value.fullName ?? '', specialty: value.specialty ?? '',
        district: value.district ?? '', address: value.address ?? '',
        rate: value.rate ?? '', selectedShift: value.selectedShift ?? [],
        selectedDay: value.selectedDay ?? [], bio: value.bio ?? ''
      };
      this.sincronizarHorariosConDias();
    });
  }

  ngOnDestroy(): void { this.subscription?.unsubscribe(); }

  get selectedShift(): string[] { return this.profileForm.value.selectedShift ?? []; }
  get selectedDay(): string[] { return this.profileForm.value.selectedDay ?? []; }
  get horarios() { return this.formState.state.profile.horarios; }
  get bioLength(): number { return this.profileForm.get('bio')?.value?.length ?? 0; }

  isShiftActive(shift: string): boolean { return this.selectedShift.includes(shift); }
  isDayActive(day: string): boolean { return this.selectedDay.includes(day); }
  isInvalid(field: string): boolean { const c = this.profileForm.get(field); return !!c && c.invalid && c.touched; }

  fieldError(field: string): string | null {
    const c = this.profileForm.get(field);
    if (!c?.touched || !c?.invalid) return null;
    if (c.hasError('required')) return `${this.fieldLabels[field] ?? field} es obligatorio.`;
    return null;
  }

  private arrayRequired(control: AbstractControl): Record<string, boolean> | null {
    const v = control.value; return Array.isArray(v) && v.length ? null : { required: true };
  }

  sanitizeNameValue(value: string): string {
    return value
      .replace(/[\t\r\n\u0000-\u001F\u007F]/g, '')
      .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '')
      .replace(/\s+/g, ' ')
      .trimStart();
  }

  sanitizeAddressValue(value: string): string {
    return value
      .replace(/[\t\r\n\u0000-\u001F\u007F]/g, '')
      .replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s.,#/-]/g, '')
      .replace(/\s+/g, ' ')
      .trimStart();
  }

  sanitizeRateValue(value: string): string {
    return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').trimStart();
  }

  sanitizeBioValue(value: string): string {
    return value
      .replace(/[\t\r\n\u0000-\u001F\u007F]/g, '')
      .replace(/\s+/g, ' ')
      .trimStart();
  }

  onFullNameInput(value: string): void {
    const sanitized = this.sanitizeNameValue(value);
    this.profileForm.get('fullName')?.setValue(sanitized, { emitEvent: false });
  }

  onAddressInput(value: string): void {
    const sanitized = this.sanitizeAddressValue(value);
    this.profileForm.get('address')?.setValue(sanitized, { emitEvent: false });
  }

  onRateInput(value: string): void {
    const sanitized = this.sanitizeRateValue(value);
    this.profileForm.get('rate')?.setValue(sanitized, { emitEvent: false });
  }

  onBioInput(value: string): void {
    const sanitized = this.sanitizeBioValue(value).slice(0, this.bioMaxLength);
    this.profileForm.get('bio')?.setValue(sanitized, { emitEvent: false });
  }

  toggleShift(shift: string): void {
    const s = [...this.selectedShift]; const i = s.indexOf(shift);
    if (i >= 0) s.splice(i, 1); else s.push(shift);
    this.profileForm.patchValue({ selectedShift: s });
  }

  toggleDay(day: string): void {
    const s = [...this.selectedDay]; const i = s.indexOf(day);
    if (i >= 0) s.splice(i, 1); else s.push(day);
    this.profileForm.patchValue({ selectedDay: s });
  }

  private ordenarDias(diasStr: string): string {
    return diasStr.split(', ')
      .sort((a, b) => (this.ordenDias[a] || 8) - (this.ordenDias[b] || 8))
      .join(', ');
  }

  sincronizarHorariosConDias(): void {
    const dias = this.selectedDay;
    for (let i = this.horarios.length - 1; i >= 0; i--) {
      const diasHorario = this.horarios[i].dia.split(', ');
      const todosFuera = diasHorario.every((d: string) => !dias.includes(d));
      if (todosFuera) {
        this.horarios.splice(i, 1);
      } else {
        const diasFiltrados = diasHorario.filter((d: string) => dias.includes(d));
        this.horarios[i].dia = this.ordenarDias(diasFiltrados.join(', '));
      }
    }
    for (const dia of dias) {
      if (!this.horarios.some(h => h.dia.split(', ').includes(dia))) {
        const turno = this.selectedShift[this.selectedShift.length - 1] || '';
        this.horarios.push({ dia, turno, inicio: '', fin: '' });
      }
    }
  }

  onHorarioChange(index: number): void {
    this.validarHorario(index);
    const h = this.horarios[index];
    if (!h.inicio || !h.fin || h.inicio >= h.fin) return;

    const otro = this.horarios.find((x, i) =>
      i !== index &&
      x.turno === h.turno &&
      x.inicio === h.inicio &&
      x.fin === h.fin
    );

    if (otro) {
      const diasUnidos = this.ordenarDias(
        [...new Set([...h.dia.split(', '), ...otro.dia.split(', ')])].join(', ')
      );
      h.dia = diasUnidos;
      const idxOtro = this.horarios.indexOf(otro);
      if (idxOtro >= 0) this.horarios.splice(idxOtro, 1);
    }
  }

  getHorasTurno(turno: string, inicio: string = ''): string[] {
    const horas = (() => {
      switch (turno) {
        case 'Mañana': return this.shiftHours['Mañana'];
        case 'Tarde': return this.shiftHours['Tarde'];
        case 'Noche': return this.shiftHours['Noche'];
        default: return [];
      }
    })();

    if (!inicio) return horas;
    return horas.filter(h => h > inicio);
  }

  formatHour(time: string): string {
    if (!time) return ''; const [h] = time.split(':'); const n = Number(h);
    if (n === 0) return '12:00 AM'; if (n < 12) return `${n}:00 AM`;
    if (n === 12) return '12:00 PM'; return `${n - 12}:00 PM`;
  }

  validarHorario(index: number): void {
    const h = this.horarios[index];
    if (h.inicio && h.fin && h.inicio >= h.fin) {
      this.errorHorario = 'La hora de salida debe ser mayor a la hora de entrada.';
      h.fin = '';
    } else {
      this.errorHorario = '';
    }
  }

  get isContinueDisabled(): boolean {
    return this.profileForm.invalid || !this.selectedShift.length || !this.selectedDay.length || this.horarios.length === 0 || !!this.errorHorario;
  }

  goToCertificado(): void {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid || this.horarios.length === 0) return;
    this.router.navigate(['/certificado']);
  }

  goToCuentaFromPerfil(): void {
    this.profileForm.markAllAsTouched();
    const mp = this.formState.getMissingProfileFields(), md = this.formState.getMissingDocumentFields();
    const m = [...mp, ...md];
    if (m.length > 0) { this.validationMissingFields = m; this.showValidationModal = true; return; }
    if (this.profileForm.invalid) return;
    this.router.navigate(['/cuenta']);
  }

  closeValidationModal(): void { this.showValidationModal = false; }
  private setDistrictFallback(): void { this.allDistricts = this.distritosFallback.map(d => ({ district: d, code: '' })); }
}