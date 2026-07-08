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
  instructoresOriginales: InstructorCatalogoDto[] = [];

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
    'MI': 3,
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

  private readonly distritosPorCodigo: Record<string, string> = {
    '140101': 'Lima',
    '140102': 'Ancón',
    '140103': 'Ate',
    '140104': 'Barranco',
    '140105': 'Breña',
    '140106': 'Carabayllo',
    '140107': 'Chaclacayo',
    '140108': 'Chorrillos',
    '140109': 'Cieneguilla',
    '140110': 'Comas',
    '140111': 'El Agustino',
    '140112': 'Independencia',
    '140113': 'Jesús María',
    '140114': 'La Molina',
    '140115': 'La Victoria',
    '140116': 'Lince',
    '140117': 'Los Olivos',
    '140118': 'Lurigancho',
    '140119': 'Lurín',
    '140120': 'Magdalena del Mar',
    '140121': 'Miraflores',
    '140122': 'Pachacámac',
    '140123': 'Pucusana',
    '140124': 'Pueblo Libre',
    '140125': 'Puente Piedra',
    '140126': 'Punta Hermosa',
    '140127': 'Punta Negra',
    '140128': 'Rímac',
    '140129': 'San Bartolo',
    '140130': 'San Borja',
    '140131': 'San Isidro',
    '140132': 'San Juan de Lurigancho',
    '140133': 'San Juan de Miraflores',
    '140134': 'San Luis',
    '140135': 'San Martín de Porres',
    '140136': 'San Miguel',
    '140137': 'Santa Anita',
    '140138': 'Santa María del Mar',
    '140139': 'Santa Rosa',
    '140140': 'Santiago de Surco',
    '140141': 'Surquillo',
    '140142': 'Villa El Salvador',
    '140143': 'Villa María del Triunfo'
  };

  private readonly distritosAlias: Record<string, string> = {
    'surco': 'Santiago de Surco',
    'sjl': 'San Juan de Lurigancho',
    'san juan de lurigancho': 'San Juan de Lurigancho',
    'san juan de miraflores': 'San Juan de Miraflores',
    'la molina': 'La Molina',
    'los olivos': 'Los Olivos',
    'san borja': 'San Borja',
    'san isidro': 'San Isidro',
    'san miguel': 'San Miguel',
    'smp': 'San Martín de Porres',
    'san martin de porres': 'San Martín de Porres',
    'san martín de porres': 'San Martín de Porres'
  };

  private readonly diasPorCodigo: Record<string, string> = {
    '1': 'Lunes',
    '2': 'Martes',
    '3': 'Miércoles',
    '4': 'Jueves',
    '5': 'Viernes',
    '6': 'Sábado',
    '7': 'Domingo',
    'L': 'Lunes',
    'M': 'Martes',
    'MI': 'Miércoles',
    'J': 'Jueves',
    'V': 'Viernes',
    'S': 'Sábado',
    'D': 'Domingo'
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
      distrito: '',
      especialidad: this.especialidadSeleccionada,
      tarifaMin: this.obtenerTarifaMin(),
      tarifaMax: this.obtenerTarifaMax(),
      turno: this.turnoSeleccionado,
    }).subscribe({
      next: (response) => {
        this.instructoresOriginales = response || [];
        this.cargarOpcionesFiltros(this.instructoresOriginales);
        this.aplicarFiltroDistritoLocal();
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
    const distritosDesdeApi = instructores
      .map(instructor => this.normalizarDistrito(instructor.distritoSede || instructor.distrito))
      .filter((valor): valor is string => !!valor);

    const distritosBase = Object.values(this.distritosPorCodigo);

    this.distritos = [...new Set([...distritosBase, ...distritosDesdeApi])].sort();

    const especialidades = instructores
      .map(instructor => instructor.especialidad)
      .filter((valor): valor is string => !!valor);

    this.especialidades = [...new Set(especialidades)].sort();
  }

  aplicarFiltroDistritoLocal(): void {
    if (!this.distritoSeleccionado) {
      this.instructores = this.instructoresOriginales;
      return;
    }

    const distritoFiltro = this.normalizarTexto(this.normalizarDistrito(this.distritoSeleccionado));

    this.instructores = this.instructoresOriginales.filter(instructor => {
      const distritoInstructor = this.normalizarTexto(
        this.normalizarDistrito(instructor.distritoSede || instructor.distrito)
      );

      return distritoInstructor === distritoFiltro;
    });
  }

  obtenerImagen(instructor: InstructorCatalogoDto): string {
    return instructor.urlImagenPerfil || 'https://via.placeholder.com/500x400?text=Instructor';
  }

  obtenerDistrito(instructor: InstructorCatalogoDto): string {
    return this.normalizarDistrito(instructor.distritoSede || instructor.distrito) || 'Sin distrito';
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
        const diaA = this.normalizarDiaSemana(a.diaSemana).split(', ')[0];
        const diaB = this.normalizarDiaSemana(b.diaSemana).split(', ')[0];

        return (this.ordenDias[diaA] || 8) - (this.ordenDias[diaB] || 8);
      })
      .map(h => {
        const dia = this.normalizarDiaSemana(h.diaSemana);
        const inicio = h.horarioInicio?.substring(0, 5) || '--:--';
        const fin = h.horarioFinal?.substring(0, 5) || '--:--';

        return `${dia} ${inicio} - ${fin}`;
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

  normalizarDistrito(valor: string | null | undefined): string {
    if (!valor) {
      return '';
    }

    const limpio = String(valor).trim();

    if (this.distritosPorCodigo[limpio]) {
      return this.distritosPorCodigo[limpio];
    }

    const clave = this.normalizarTexto(limpio);

    return this.distritosAlias[clave] || limpio;
  }

  normalizarDiaSemana(valor: string | null | undefined): string {
    if (!valor) {
      return 'Sin día';
    }

    const limpio = String(valor).trim();
    const mayuscula = limpio.toUpperCase();

    return this.diasPorCodigo[limpio] || this.diasPorCodigo[mayuscula] || limpio;
  }

  normalizarTexto(valor: string): string {
    return valor
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}