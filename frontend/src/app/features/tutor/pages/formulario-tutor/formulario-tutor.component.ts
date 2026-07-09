import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Location, Ubication } from '../../../../shared/services/location.service';
import { Subscription } from 'rxjs';

import { RegistrationApiService } from '../../../auth/services/registration-api.service';
import { HeaderComponent } from '../../../../shared/components/header/landing-header/landing-header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-formulario-tutor',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HeaderComponent, FooterComponent],
  providers: [Location],
  templateUrl: './formulario-tutor.component.html',
  styleUrls: ['./formulario-tutor.component.scss'],
})
export class FormularioTutor implements OnInit, OnDestroy {
  paso = 1;

  // Paso 1 - Datos
  nombreTutor = '';
  nombrePaciente = '';
  condicion = '';
  gradoAutismo = '';
  genero = '';
  edad: number | null = null;
  distrito = '';
  direccion = '';
  allDistricts: Ubication[] = [];
  private subscription?: Subscription;

  // Paso 2 - Protocolo
  protocoloEmergencia = '';
  readonly protocoloEmergenciaMaxLength = 250;
  protocoloEmergenciaLength = 0;
  sensibilidadesSeleccionadas: string[] = [];

  // Paso 3 - Contacto
  nombreContacto = '';
  telefonoContacto = '';
  relacionContacto = '';

  // Paso 4 - Cuenta
  correo = '';
  contrasena = '';
  fotoPaciente: File | null = null;
  fotoPacienteNombre = '';
  fotoPacientePreview: string | null = null;
  loading = false;
  errorMessage = '';
  submittedSteps = { 1: false, 2: false, 3: false, 4: false };
  showPassword = false;
  modalVisible = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'error' | 'success' = 'error';
  private loadingStartedAt = 0;
  private readonly minLoadingMs = 3000;
  passwordStrength = 0;
  passwordStrengthLabel = 'Sin contraseña';
  passwordStrengthClass = 'weak';
  correoTocado = false;

  private readonly namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  private readonly emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  private readonly passwordPattern = /^[A-Za-z0-9!@#$%^&*()_+\-=?.,:]+$/;

  constructor(
    private router: Router,
    private locationService: Location,
    private registrationApiService: RegistrationApiService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public sanitizeNameValue(value: string): string {
    return value
      .replace(/[\t\r\n\u0000-\u001F\u007F]/g, '')
      .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  public sanitizeAddressValue(value: string): string {
    return value
      .replace(/[\t\r\n\u0000-\u001F\u007F]/g, '')
      .replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s.,#/-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  public sanitizeEmailValue(value: string): string {
    return value.replace(/[\s\t\r\n\u0000-\u001F\u007F]/g, '').trim();
  }

  public sanitizePasswordValue(value: string): string {
    return value.replace(/[\s\t\r\n\u0000-\u001F\u007F]/g, '').trim();
  }

  public sanitizePhoneValue(value: string): string {
    return value.replace(/\D/g, '').slice(0, 9);
  }

  public onInvalidCharacterKeydown(event: KeyboardEvent, mode: 'letters' | 'numbers' | 'address' | 'email' | 'password'): void {
    const key = event.key;
    const allowedKeys = ['Tab', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Escape', 'Enter'];
    const target = event.target as HTMLInputElement | null;
    const selectionStart = target?.selectionStart ?? 0;
    const selectionEnd = target?.selectionEnd ?? 0;
    const currentValue = target?.value ?? '';

    if (allowedKeys.includes(key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (key === ' ' && (currentValue.length === 0 || selectionStart === 0)) {
      event.preventDefault();
      return;
    }

    const regexMap: Record<'letters' | 'numbers' | 'address' | 'email' | 'password', RegExp> = {
      letters: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/,
      numbers: /^\d$/,
      address: /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s.,#/-]$/,
      email: /^[A-Za-z0-9._%+\-@]$/,
      password: /^[A-Za-z0-9!@#$%^&*()_+\-=?.,:]$/,
    };

    if (selectionStart !== selectionEnd) {
      return;
    }

    if (!regexMap[mode].test(key)) {
      event.preventDefault();
    }
  }

  public sanitizeAgeValue(value: string): string {
    return value.replace(/\D/g, '').slice(0, 3);
  }

  public parseAgeValue(value: string): number | null {
    const sanitized = this.sanitizeAgeValue(value);
    return sanitized ? Number(sanitized) : null;
  }

  onNombreTutorInput(value: string): void {
    this.nombreTutor = this.sanitizeNameValue(value);
  }

  onNombrePacienteInput(value: string): void {
    this.nombrePaciente = this.sanitizeNameValue(value);
  }

  onDireccionInput(value: string): void {
    this.direccion = this.sanitizeAddressValue(value);
  }

  onCondicionInput(value: string): void {
    this.condicion = this.sanitizeNameValue(value);
  }

  onEdadInput(value: string | number | null): void {
    this.edad = this.parseAgeValue(String(value ?? ''));
  }

  onEdadBlur(): void {
    this.edad = this.edad && this.edad > 0 ? this.edad : null;
  }

  onNombreContactoInput(value: string): void {
    this.nombreContacto = this.sanitizeNameValue(value);
  }

  onTelefonoInput(value: string): void {
    this.telefonoContacto = this.sanitizePhoneValue(value);
  }

  onCorreoInput(value: string): void {
    this.correoTocado = true;
    this.correo = this.sanitizeEmailValue(value);
  }

  onCorreoBlur(): void {
    this.correoTocado = true;
    this.correo = this.sanitizeEmailValue(this.correo).trim();
  }

  get showCorreoError(): boolean {
    return this.correoTocado && !this.isValidEmail(this.correo);
  }

  get correoFeedbackMessage(): string {
    return !this.correo.trim() ? 'El correo es obligatorio.' : 'Debe seguir el formato ejemplo@dominio.com';
  }

  onProtocoloInput(value: string): void {
    this.protocoloEmergencia = this.sanitizeAddressValue(value);
    this.protocoloEmergenciaLength = this.protocoloEmergencia.length;
  }

  public updatePasswordStrength(): void {
    const value = this.sanitizePasswordValue(this.contrasena);
    this.contrasena = value;

    let score = 0;
    if (value.length >= 8) score += 1;
    if (value.length >= 10) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[a-z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (this.passwordPattern.test(value)) score += 1;

    this.passwordStrength = Math.min(score, 6);

    if (!value) {
      this.passwordStrengthLabel = 'Sin contraseña';
      this.passwordStrengthClass = 'weak';
      return;
    }

    if (this.passwordStrength <= 2) {
      this.passwordStrengthLabel = 'Débil';
      this.passwordStrengthClass = 'weak';
    } else if (this.passwordStrength <= 4) {
      this.passwordStrengthLabel = 'Media';
      this.passwordStrengthClass = 'medium';
    } else {
      this.passwordStrengthLabel = 'Fuerte';
      this.passwordStrengthClass = 'strong';
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  closeModal(): void {
    this.modalVisible = false;
  }

  private showModal(title: string, message: string, type: 'error' | 'success' = 'error'): void {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalType = type;
    this.modalVisible = true;
  }

  private async waitForMinimumLoading(): Promise<void> {
    const elapsed = Date.now() - this.loadingStartedAt;
    const remaining = this.minLoadingMs - elapsed;
    if (remaining > 0) {
      await new Promise(resolve => setTimeout(resolve, remaining));
    }
  }

  loadDistricts(): void {
    this.subscription = this.locationService.getDistrictsByUbigeoPrefix('1501').subscribe(list => {
      this.allDistricts = list.sort((a, b) => a.district.localeCompare(b.district));
    });
  }
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

  private isValidName(value: string): boolean {
    return this.namePattern.test(this.sanitizeNameValue(value));
  }

  private isValidAddress(value: string): boolean {
    return this.sanitizeAddressValue(value).length > 0;
  }

  private isValidEmail(value: string): boolean {
    return this.emailPattern.test(this.sanitizeEmailValue(value));
  }

  private isValidPassword(value: string): boolean {
    const sanitized = this.sanitizePasswordValue(value);
    return sanitized.length >= 8 && sanitized.length <= 10 && this.passwordPattern.test(sanitized);
  }

  private isValidPhone(value: string): boolean {
    return this.sanitizePhoneValue(value).length === 9;
  }

  private isValidAge(value: number | null): boolean {
    return value !== null && value > 0 && this.sanitizeAgeValue(String(value)).length > 0;
  }

  // Validación de campos obligatorios
  isStep1Valid(): boolean {
    return (
      this.isValidName(this.nombreTutor) &&
      this.isValidName(this.nombrePaciente) &&
      this.isValidAddress(this.condicion) &&
      this.gradoAutismo.trim() !== '' &&
      this.genero.trim() !== '' &&
      this.isValidAge(this.edad) &&
      this.distrito.trim() !== '' &&
      this.isValidAddress(this.direccion)
    );
  }

  isStep2Valid(): boolean {
    return (
      this.sensibilidadesSeleccionadas.length > 0 &&
      this.sanitizeAddressValue(this.protocoloEmergencia).trim() !== ''
    );
  }

  isStep3Valid(): boolean {
    return (
      this.isValidName(this.nombreContacto) &&
      this.isValidPhone(this.telefonoContacto) &&
      this.relacionContacto.trim() !== ''
    );
  }

  isStep4Valid(): boolean {
    return (
      this.isValidEmail(this.correo) &&
      this.isValidPassword(this.contrasena) &&
      this.fotoPaciente !== null
    );
  }

  get canContinue(): boolean {
    switch (this.paso) {
      case 1:
        return this.isStep1Valid();
      case 2:
        return this.isStep2Valid();
      case 3:
        return this.isStep3Valid();
      case 4:
        return this.isStep4Valid();
      default:
        return false;
    }
  }

  siguiente() {
    if (this.paso === 1 && !this.isStep1Valid()) {
      this.submittedSteps[1] = true;
      return;
    }
    if (this.paso === 2 && !this.isStep2Valid()) {
      this.submittedSteps[2] = true;
      return;
    }
    if (this.paso === 3 && !this.isStep3Valid()) {
      this.submittedSteps[3] = true;
      return;
    }

    if (this.paso < 4) {
      this.paso++;
    } else {
      this.finalizar();
    }
  }

  atras() {
    if (this.paso > 1) {
      this.paso--;
    }
  }

  toggleSensibilidad(sensibilidad: string) {
    if (this.sensibilidadesSeleccionadas.includes(sensibilidad)) {
      this.sensibilidadesSeleccionadas =
        this.sensibilidadesSeleccionadas.filter(s => s !== sensibilidad);
    } else {
      this.sensibilidadesSeleccionadas.push(sensibilidad);
    }
  }

  estaSeleccionada(sensibilidad: string): boolean {
    return this.sensibilidadesSeleccionadas.includes(sensibilidad);
  }

  onFotoChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.fotoPaciente = file;
      this.fotoPacienteNombre = file.name;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.fotoPacientePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.fotoPacientePreview = null;
        this.errorMessage = 'Solo se permiten archivos de imagen.';
      }
    }
  }

  async finalizar() {
    console.log('Botón Finalizar presionado');

    if (this.loading) {
      return;
    }

    this.submittedSteps[4] = true;
    this.correoTocado = true;
    this.correo = this.sanitizeEmailValue(this.correo).trim();

    if (!this.isValidEmail(this.correo)) {
      this.showModal('Correo inválido', 'Ingresa un correo electrónico válido para continuar.');
      return;
    }

    if (!this.isValidPassword(this.contrasena)) {
      this.showModal('Contraseña inválida', 'La contraseña debe tener entre 8 y 10 caracteres, sin espacios ni caracteres inválidos.');
      return;
    }

    if (!this.fotoPaciente) {
      this.showModal('Foto obligatoria', 'Debes subir una foto del paciente para finalizar el registro.');
      return;
    }

    if (this.edad == null) {
      this.showModal('Edad incompleta', 'Debes ingresar la edad del paciente para continuar.');
      return;
    }

    this.loading = true;
    this.loadingStartedAt = Date.now();
    this.errorMessage = '';

    try {
      await this.registrationApiService.registrarTutorConPaciente({
        tutorNombre: this.nombreTutor,
        pacienteNombre: this.nombrePaciente,
        condicion: this.condicion,
        gradoAutismo: this.gradoAutismo,
        genero: this.genero,
        edad: this.edad,
        distrito: this.distrito,
        direccion: this.direccion,
        correo: this.correo,
        clave: this.contrasena,
        fotoPaciente: this.fotoPaciente,
        protocoloEmergencia: this.protocoloEmergencia,
        sensibilidades: this.sensibilidadesSeleccionadas,
        nombreContacto: this.nombreContacto,
        telefonoContacto: this.telefonoContacto,
        relacionContacto: this.relacionContacto,
      });

      await this.waitForMinimumLoading();
      localStorage.setItem('rolSeleccionado', 'tutor');
      this.router.navigate(['/tutor/inicio']);

    } catch (error: any) {
      console.error('Error al registrar tutor:', error);
      const message = error?.error?.message ?? error?.message ?? 'No se pudo completar el registro';
      this.showModal('No se pudo completar el registro', message);
    } finally {
      this.loading = false;
    }
  }
}
