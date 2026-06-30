import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  InstructorCatalogoDto,
  TutorApiService
} from '../../services/tutor-api.service';

@Component({
  selector: 'app-catalogo-instructor',
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo-instructor.component.html',
  styleUrls: ['./catalogo-instructor.component.scss'],
})
export class CatalogoInstructor implements OnInit {
  instructores: InstructorCatalogoDto[] = [];
  cargando = true;
  errorMessage = '';

  textoBusqueda = '';
  distritoSeleccionado = '';
  especialidadSeleccionada = '';

  mostrarFiltrosAvanzados = false;
  tarifaSeleccionada = '';
  turnoSeleccionado = '';

  distritos: string[] = [];
  especialidades: string[] = [];

  constructor(
    private tutorApiService: TutorApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  cargarCatalogo(): void {
    this.cargando = true;
    this.errorMessage = '';

    this.tutorApiService.buscarInstructoresCatalogo({
      texto: this.textoBusqueda,
      distrito: this.distritoSeleccionado,
      especialidad: this.especialidadSeleccionada,
      tarifaMin: this.obtenerTarifaMin(),
      tarifaMax: this.obtenerTarifaMax(),
      turno: this.turnoSeleccionado,
    }).subscribe({
      next: (response) => {
        this.instructores = response || [];
        this.cargarOpcionesFiltros(this.instructores);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar catálogo de instructores:', err);
        this.errorMessage = 'No se pudieron cargar los instructores.';
        this.cargando = false;
      }
    });
  }

  buscar(): void {
    this.cargarCatalogo();
  }

  limpiarFiltros(): void {
    this.textoBusqueda = '';
    this.distritoSeleccionado = '';
    this.especialidadSeleccionada = '';
    this.tarifaSeleccionada = '';
    this.turnoSeleccionado = '';
    this.cargarCatalogo();
  }

  toggleFiltrosAvanzados(): void {
    this.mostrarFiltrosAvanzados = !this.mostrarFiltrosAvanzados;
  }

  cargarOpcionesFiltros(instructores: InstructorCatalogoDto[]): void {
    const distritos = instructores
      .map(instructor => instructor.distritoSede || instructor.distrito)
      .filter((valor): valor is string => !!valor);

    const especialidades = instructores
      .map(instructor => instructor.especialidad)
      .filter((valor): valor is string => !!valor);

    this.distritos = [...new Set(distritos)];
    this.especialidades = [...new Set(especialidades)];
  }

  obtenerImagen(instructor: InstructorCatalogoDto): string {
    return instructor.urlImagenPerfil || 'https://via.placeholder.com/500x400?text=Instructor';
  }

  obtenerDistrito(instructor: InstructorCatalogoDto): string {
    return instructor.distritoSede || instructor.distrito || 'Sin distrito';
  }

  obtenerDireccion(instructor: InstructorCatalogoDto): string {
    return instructor.direccionSede || instructor.direccion || 'Sin sede registrada';
  }

  obtenerTarifa(instructor: InstructorCatalogoDto): string {
    if (instructor.tarifaHora === null || instructor.tarifaHora === undefined) {
      return 'S/ --';
    }

    return `S/ ${Number(instructor.tarifaHora).toFixed(0)}/h`;
  }

  obtenerHorario(instructor: InstructorCatalogoDto): string {
    if (!instructor.diaDisponible || !instructor.horarioInicio || !instructor.horarioFinal) {
      return 'Horario no registrado';
    }

    const dia = this.formatearTexto(instructor.diaDisponible);
    const inicio = this.formatearHora(instructor.horarioInicio);
    const fin = this.formatearHora(instructor.horarioFinal);

    return `${dia} ${inicio} - ${fin}`;
  }

  obtenerRating(instructor: InstructorCatalogoDto): string {
    if (
      instructor.promedioCalificacion === null ||
      instructor.promedioCalificacion === undefined
    ) {
      return '0.0';
    }

    return Number(instructor.promedioCalificacion).toFixed(1);
  }

  obtenerSesiones(instructor: InstructorCatalogoDto): number {
    if (
      instructor.totalSesiones === null ||
      instructor.totalSesiones === undefined
    ) {
      return 0;
    }

    return Number(instructor.totalSesiones);
  }

  obtenerTarifaMin(): number | null {
    switch (this.tarifaSeleccionada) {
      case '0-50':
        return 0;
      case '50-80':
        return 50;
      case '80-120':
        return 80;
      case '120-mas':
        return 120;
      default:
        return null;
    }
  }

  obtenerTarifaMax(): number | null {
    switch (this.tarifaSeleccionada) {
      case '0-50':
        return 50;
      case '50-80':
        return 80;
      case '80-120':
        return 120;
      case '120-mas':
        return null;
      default:
        return null;
    }
  }

  verPerfil(instructor: InstructorCatalogoDto): void {
    this.router.navigate(['/tutor/perfil-instructor', instructor.idInstructor]);
  }

  solicitarSesion(instructor: InstructorCatalogoDto): void {
    this.router.navigate(['/tutor/reserva'], {
      queryParams: {
        idInstructor: instructor.idInstructor,
        idSede: instructor.idSede,
        tarifaHora: instructor.tarifaHora
      }
    });
  }

  private formatearHora(hora: string): string {
    if (!hora) {
      return '';
    }

    return hora.substring(0, 5);
  }

  private formatearTexto(valor: string): string {
    if (!valor) {
      return '';
    }

    return valor.charAt(0).toUpperCase() + valor.slice(1);
  }
}