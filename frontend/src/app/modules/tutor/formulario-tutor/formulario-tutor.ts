import { FormsModule } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Location, Ubication } from '../../../services/location';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-formulario-tutor',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [Location],
  templateUrl: './formulario-tutor.html',
  styleUrl: './formulario-tutor.css',
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

  constructor(
    private router: Router,
    private locationService: Location
  ) { }

  ngOnInit(): void {
    this.loadDistricts();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadDistricts(): void {
    this.subscription = this.locationService.getDistrictsByUbigeoPrefix('1401').subscribe(list => {
      this.allDistricts = list.sort((a, b) => a.district.localeCompare(b.district));
    });
  }

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

  finalizar() {
    // Aquí irá la lógica para guardar los datos
    console.log('Formulario completo:', {
      nombreTutor: this.nombreTutor,
      nombrePaciente: this.nombrePaciente,
      condicion: this.condicion,
      gradoAutismo: this.gradoAutismo,
      genero: this.genero,
      edad: this.edad,
      distrito: this.distrito,
      direccion: this.direccion,
      protocoloEmergencia: this.protocoloEmergencia,
      sensibilidades: this.sensibilidadesSeleccionadas,
      nombreContacto: this.nombreContacto,
      telefonoContacto: this.telefonoContacto,
      relacionContacto: this.relacionContacto,
      correo: this.correo,
      fotoPaciente: this.fotoPacienteNombre,
    });

    this.router.navigate(['/tutor']);
  }
}
