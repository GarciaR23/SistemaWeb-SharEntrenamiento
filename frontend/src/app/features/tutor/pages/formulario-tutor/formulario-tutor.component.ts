import { FormsModule } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Location, Ubication } from '../../../../shared/services/location.service';
import { Subscription } from 'rxjs';

import { RegistrationApiService } from '../../../auth/services/registration-api.service';
import { HeaderComponent } from '../../../../shared/components/header/landing-header/landing-header.component';

@Component({
  selector: 'app-formulario-tutor',
  standalone: true,
  imports: [FormsModule, HttpClientModule, HeaderComponent],
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
  loading = false;
  errorMessage = '';

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

  // Validación de campos obligatorios
  isStep1Valid(): boolean {
    return (
      this.nombreTutor.trim() !== '' &&
      this.nombrePaciente.trim() !== '' &&
      this.condicion.trim() !== '' &&
      this.gradoAutismo.trim() !== '' &&
      this.genero.trim() !== '' &&
      this.edad !== null &&
      this.edad > 0 &&
      this.distrito.trim() !== '' &&
      this.direccion.trim() !== ''
    );
  }

  isStep2Valid(): boolean {
    return (
      this.sensibilidadesSeleccionadas.length > 0 &&
      this.protocoloEmergencia.trim() !== ''
    );
  }

  isStep3Valid(): boolean {
    return (
      this.nombreContacto.trim() !== '' &&
      this.telefonoContacto.trim() !== '' &&
      this.relacionContacto.trim() !== ''
    );
  }

  isStep4Valid(): boolean {
    return (
      this.correo.trim() !== '' &&
      this.contrasena.trim() !== '' &&
      this.fotoPaciente !== null
    );
  }

  siguiente() {
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
      this.fotoPaciente = files[0];
      this.fotoPacienteNombre = files[0].name;
    }
  }

  async finalizar() {
    console.log('Botón Finalizar presionado');

    if (this.loading) {
      return;
    }

    if (!this.correo.trim()) {
      this.errorMessage = 'Debes ingresar un correo electrónico';
      return;
    }

    if (!this.contrasena.trim()) {
      this.errorMessage = 'Debes ingresar una contraseña';
      return;
    }

    if (this.contrasena.trim().length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    if (!this.fotoPaciente) {
      this.errorMessage = 'Debes subir una foto del paciente';
      return;
    }

    if (this.edad == null) {
      this.errorMessage = 'Debes ingresar la edad del paciente';
      return;
    }

    this.loading = true;
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

      localStorage.setItem('rolSeleccionado', 'tutor');
      this.router.navigate(['/tutor/inicio']);

    } catch (error: any) {
      console.error('Error al registrar tutor:', error);
      this.errorMessage =
        error?.error?.message ??
        error?.message ??
        'No se pudo completar el registro';
    } finally {
      this.loading = false;
    }
  }
}
