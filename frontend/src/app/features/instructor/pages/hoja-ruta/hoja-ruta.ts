import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type EstadoHojaRuta = 'por_configurar' | 'por_revision' | 'observado' | 'completado';

interface ActividadRuta {
  id: number;
  nombre: string;
  duracionMin: number;
}

interface SesionHojaRuta {
  idSesion: number;
  pacienteNombre: string;
  condicion: string;
  fechaLabel: string;
  horaLabel: string;
  duracionMin: number;
  ubicacion: string;
  estado: EstadoHojaRuta;
  avatarUrl: string;
  instructorUrl: string;
  feedbackTutor?: string;
  hojaRuta?: {
    sede: string;
    actividades: ActividadRuta[];
  };
}

@Component({
  selector: 'app-hoja-ruta',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './hoja-ruta.html',
  styleUrl: './hoja-ruta.scss',
})
export class hojaRutaComponent {
  textoBusqueda = '';
  filtroActivo: EstadoHojaRuta | 'todos' = 'todos';

  modalAbierto = false;
  sesionSeleccionada: SesionHojaRuta | null = null;

  // Vacío hasta cargar desde el backend
  sedesMock: string[] = [];

  // Si las imágenes también vendrán del backend
  imagenesSede: string[] = [];

  // Formulario inicial vacío
  formulario = {
    sede: '',
    actividades: [] as ActividadRuta[],
  };

  // Sin sesiones
  sesiones: SesionHojaRuta[] = [];

  get sesionesFiltradas(): SesionHojaRuta[] {
    const query = this.textoBusqueda.trim().toLowerCase();

    return this.sesiones.filter((sesion) => {
      const coincideTexto =
        sesion.pacienteNombre.toLowerCase().includes(query) ||
        sesion.idSesion.toString().includes(query);

      const coincideFiltro = this.filtroActivo === 'todos' || sesion.estado === this.filtroActivo;

      return coincideTexto && coincideFiltro;
    });
  }

  get totalPorConfigurar(): number {
    return this.sesiones.filter((s) => s.estado === 'por_configurar').length;
  }

  get totalObservadas(): number {
    return this.sesiones.filter((s) => s.estado === 'observado').length;
  }

  get totalCompletadas(): number {
    return this.sesiones.filter((s) => s.estado === 'completado').length;
  }

  get cargaTiempoActual(): number {
    return this.formulario.actividades.reduce(
      (total, actividad) => total + Number(actividad.duracionMin || 0),
      0,
    );
  }

  get excedeLimite(): boolean {
    return this.cargaTiempoActual > (this.sesionSeleccionada?.duracionMin || 60);
  }

  get minutosExcedidos(): number {
    return Math.max(this.cargaTiempoActual - (this.sesionSeleccionada?.duracionMin || 60), 0);
  }

  abrirModal(sesion: SesionHojaRuta): void {
    this.sesionSeleccionada = sesion;

    if (sesion.hojaRuta) {
      this.formulario = {
        sede: sesion.hojaRuta.sede,
        actividades: sesion.hojaRuta.actividades.map((actividad) => ({ ...actividad })),
      };
    } else {
      this.formulario = {
        sede: '',
        actividades: [],
      };
    }

    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.sesionSeleccionada = null;
  }

  agregarActividad(): void {
    this.formulario.actividades.push({
      id: Date.now(),
      nombre: '',
      duracionMin: 5,
    });
  }

  eliminarActividad(id: number): void {
    if (this.formulario.actividades.length === 1) return;
    this.formulario.actividades = this.formulario.actividades.filter(
      (actividad) => actividad.id !== id,
    );
  }

  get porcentajeCarga(): number {
    const limite = this.sesionSeleccionada?.duracionMin || 60;
    return Math.min((this.cargaTiempoActual / limite) * 100, 100);
  }

  guardarHojaRuta(): void {
    if (!this.sesionSeleccionada || this.actividadesInvalidas || this.excedeLimite) return;

    const index = this.sesiones.findIndex((s) => s.idSesion === this.sesionSeleccionada?.idSesion);
    if (index === -1) return;

    this.sesiones[index] = {
      ...this.sesiones[index],
      estado: 'por_revision',
      feedbackTutor: undefined,
      hojaRuta: {
        sede: this.formulario.sede,
        actividades: this.formulario.actividades.map((actividad) => ({
          ...actividad,
          nombre: actividad.nombre.trim(),
          duracionMin: Number(actividad.duracionMin),
        })),
      },
    };

    this.cerrarModal();
  }

  get actividadesInvalidas(): boolean {
    return this.formulario.actividades.some(
      (actividad) => !actividad.nombre.trim() || Number(actividad.duracionMin) <= 0,
    );
  }

  verDetalles(sesion: SesionHojaRuta): void {
    // Aquí abrirás el detalle o consultarás el backend
  }

  simularFeedbackTutor(sesion: SesionHojaRuta): void {
    // El feedback llegará desde el backend
  }

  obtenerTituloEstado(sesion: SesionHojaRuta): string {
    switch (sesion.estado) {
      case 'por_configurar':
        return 'Sin actividades asignadas';
      case 'por_revision':
        return 'Enviado al Tutor';
      case 'observado':
        return 'Feedback del Tutor';
      case 'completado':
        return 'Hoja Completada';
      default:
        return 'Sin actividades asignadas';
    }
  }

  obtenerDescripcionEstado(sesion: SesionHojaRuta): string {
    switch (sesion.estado) {
      case 'por_configurar':
        return 'Trazar objetivos técnicos para esta sesión.';
      case 'por_revision':
        return 'La hoja fue enviada para validación del tutor.';
      case 'observado':
        return sesion.feedbackTutor || 'El tutor solicitó ajustes en la hoja.';
      case 'completado':
        return 'Configuración de rutina de ejercicios';
      default:
        return '';
    }
  }

  obtenerSesiones(): void {
    // Aquí llamarás al servicio que devuelve las sesiones
    // this.hojaRutaService.obtenerSesiones().subscribe(...)
  }

  ngOnInit(): void {
    this.obtenerSesiones();
  }
}
