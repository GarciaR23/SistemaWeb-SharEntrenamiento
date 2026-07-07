import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TutorApiService } from '../../services/tutor-api.service';
import { InstructorCatalogoDto } from '../../models/instructor-catalogo.model';

type TipoFiltro = 'distrito' | 'especialidad' | 'tarifa' | 'turno';

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
  tarifaSeleccionada = '';
  turnoSeleccionado = '';

  distritos: string[] = [];
  especialidades: string[] = [];

  mostrarPanelFiltros = false;
  filtroAbierto: TipoFiltro | null = null;

  filtrosTemp: {
    distrito: string;
    especialidad: string;
    tarifa: string;
    turno: string;
  } = {
    distrito: '',
    especialidad: '',
    tarifa: '',
    turno: ''
  };

  private readonly ordenDias: Record<string, number> = {
    'L': 1,
    'M': 2,
    'Mi': 3,
    'J': 4,
    'V': 5,
    'S': 6,
    'D': 7,
    'Lunes': 1,
    'Martes': 2,
    'Miércoles': 3,
    'Miercoles': 3,
    'Jueves': 4,
    'Viernes': 5,
    'Sábado': 6,
    'Sabado': 6,
    'Domingo': 7
  };

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
        console.error('Error al cargar catálogo:', err);
        this.errorMessage = 'No se pudieron cargar los instructores.';
        this.cargando = false;
      }
    });
  }

  buscar(): void {
    this.cargarCatalogo();
  }

  abrirPanelFiltros(): void {
    this.filtrosTemp = {
      distrito: this.distritoSeleccionado,
      especialidad: this.especialidadSeleccionada,
      tarifa: this.tarifaSeleccionada,
      turno: this.turnoSeleccionado
    };

    this.mostrarPanelFiltros = true;
  }

  cerrarPanelFiltros(): void {
    this.mostrarPanelFiltros = false;
    this.filtroAbierto = null;
  }

  togglePanelFiltros(): void {
    if (this.mostrarPanelFiltros) {
      this.cerrarPanelFiltros();
    } else {
      this.abrirPanelFiltros();
    }
  }

  toggleFiltro(tipo: TipoFiltro): void {
    this.filtroAbierto = this.filtroAbierto === tipo ? null : tipo;
  }

  agregarFiltro(tipo: TipoFiltro): void {
    if (tipo === 'distrito') {
      this.distritoSeleccionado = this.filtrosTemp.distrito;
    }

    if (tipo === 'especialidad') {
      this.especialidadSeleccionada = this.filtrosTemp.especialidad;
    }

    if (tipo === 'tarifa') {
      this.tarifaSeleccionada = this.filtrosTemp.tarifa;
    }

    if (tipo === 'turno') {
      this.turnoSeleccionado = this.filtrosTemp.turno;
    }

    this.filtroAbierto = null;
  }

  aplicarFiltrosPanel(): void {
    this.distritoSeleccionado = this.filtrosTemp.distrito;
    this.especialidadSeleccionada = this.filtrosTemp.especialidad;
    this.tarifaSeleccionada = this.filtrosTemp.tarifa;
    this.turnoSeleccionado = this.filtrosTemp.turno;

    this.cargarCatalogo();
    this.cerrarPanelFiltros();
  }

  limpiarFiltros(): void {
    this.textoBusqueda = '';

    this.distritoSeleccionado = '';
    this.especialidadSeleccionada = '';
    this.tarifaSeleccionada = '';
    this.turnoSeleccionado = '';

    this.filtrosTemp = {
      distrito: '',
      especialidad: '',
      tarifa: '',
      turno: ''
    };

    this.filtroAbierto = null;
    this.cargarCatalogo();
  }

  limpiarFiltrosPanel(): void {
    this.distritoSeleccionado = '';
    this.especialidadSeleccionada = '';
    this.tarifaSeleccionada = '';
    this.turnoSeleccionado = '';

    this.filtrosTemp = {
      distrito: '',
      especialidad: '',
      tarifa: '',
      turno: ''
    };

    this.filtroAbierto = null;
    this.cargarCatalogo();
  }

  hayFiltrosActivos(): boolean {
    return !!(
      this.distritoSeleccionado ||
      this.especialidadSeleccionada ||
      this.tarifaSeleccionada ||
      this.turnoSeleccionado
    );
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
    if (!instructor.horarios?.length) {
      return 'Horario no registrado';
    }

    return instructor.horarios
      .slice()
      .sort((a, b) => {
        const diaA = a.diaSemana?.split(', ')[0] || '';
        const diaB = b.diaSemana?.split(', ')[0] || '';

        return (this.ordenDias[diaA] || 8) - (this.ordenDias[diaB] || 8);
      })
      .map(h => {
        const inicio = h.horarioInicio?.substring(0, 5) || '--:--';
        const fin = h.horarioFinal?.substring(0, 5) || '--:--';

        return `${h.diaSemana || 'Sin día'} ${inicio} - ${fin}`;
      })
      .join(' | ');
  }

  obtenerRating(instructor: InstructorCatalogoDto): string {
    if (instructor.promedioCalificacion === null || instructor.promedioCalificacion === undefined) {
      return '0.0';
    }

    return Number(instructor.promedioCalificacion).toFixed(1);
  }

  obtenerSesiones(instructor: InstructorCatalogoDto): number {
    if (instructor.totalSesiones === null || instructor.totalSesiones === undefined) {
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

  obtenerLabelTarifa(valor: string): string {
    switch (valor) {
      case '0-50':
        return 'Hasta S/ 50';
      case '50-80':
        return 'S/ 50 - S/ 80';
      case '80-120':
        return 'S/ 80 - S/ 120';
      case '120-mas':
        return 'Más de S/ 120';
      default:
        return '';
    }
  }

  obtenerLabelTurno(valor: string): string {
    switch (valor) {
      case 'mañana':
        return 'Mañana';
      case 'tarde':
        return 'Tarde';
      case 'noche':
        return 'Noche';
      default:
        return '';
    }
  }

  verPerfil(instructor: InstructorCatalogoDto): void {
    this.router.navigate(['/tutor/perfil-instructor', instructor.idInstructor]);
  }

  solicitarSesion(instructor: InstructorCatalogoDto): void {
    this.router.navigate(['/tutor/reserva-sesion'], {
      queryParams: {
        idInstructor: instructor.idInstructor
      }
    });
  }
}