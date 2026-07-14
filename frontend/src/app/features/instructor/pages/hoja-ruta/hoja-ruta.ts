import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContadorHojas, HojaRutaService } from '../../services/hoja-ruta.service';
import { CardHojaRuta } from '../../models/card-hoja.model';
import { FormularioHojaRuta } from '../../models/formulario-hoja.model';

type EstadoHojaRuta = 'por_configurar' | 'completado' | 'con_observacion';

interface ActividadRuta {
  id: number;
  nombre: string;
  duracionMin: number;
  tipoEjercicio: string;
  descripcion: string;
}

@Component({
  selector: 'app-hoja-ruta',
  imports: [CommonModule, FormsModule],
  templateUrl: './hoja-ruta.html',
  styleUrl: './hoja-ruta.scss',
})
export class HojaRutaComponent implements OnInit {
  textoBusqueda = '';
  filtroActivo: EstadoHojaRuta | 'todos' = 'por_configurar';
  idInstructor: number | null = null;
  nombreInstructor = '';

  modalAbierto = false;
  sesionSeleccionada: CardHojaRuta | null = null;
  formularioData: FormularioHojaRuta | null = null;

  sesiones: CardHojaRuta[] = [];
  contador: ContadorHojas = { porConfigurar: 0, completado: 0, conObservacion: 0 };

  cargando = false;
  guardando = false;
  errorMessage = '';
  exitoMessage = '';

  actividades: ActividadRuta[] = [];
  sedeSeleccionada = '';

  constructor(private hojaRutaService: HojaRutaService) { }

  ngOnInit(): void {
    this.obtenerIdInstructor();
    this.cargarDatos();
    this.cargarNombreInstructor();
  }

  cargarNombreInstructor(): void {
    const usuarioString = localStorage.getItem('authUser_instructor');
    if (usuarioString) {
      try {
        const usuario = JSON.parse(usuarioString);
        this.nombreInstructor = usuario.nombreCompleto || usuario.nombre || usuario.nombres
          || usuario.instructor?.nombreCompleto || usuario.instructor?.nombre
          || this.extraerNombreDeEmail(usuario.email) || 'Instructor';
      } catch { this.nombreInstructor = 'Instructor'; }
    }
  }

  private extraerNombreDeEmail(email: string): string {
    if (!email) return '';
    const partes = email.split('@');
    return partes[0].charAt(0).toUpperCase() + partes[0].slice(1);
  }

  obtenerIdInstructor(): void {
    const usuarioString = localStorage.getItem('authUser_instructor');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.idInstructor = usuario.idInstructor || null;
    }
  }

  cargarDatos(): void {
    if (!this.idInstructor) return;
    this.cargando = true;
    this.hojaRutaService.obtenerCardsClasificadas(this.idInstructor).subscribe({
      next: (data) => { this.sesiones = data; this.cargando = false; },
      error: () => { this.errorMessage = 'Error al cargar las hojas de ruta.'; this.cargando = false; }
    });
    this.hojaRutaService.obtenerContadorHojas(this.idInstructor).subscribe({
      next: (data) => { this.contador = data; }
    });
  }

  get sesionesFiltradas(): CardHojaRuta[] {
    const query = this.textoBusqueda.trim().toLowerCase();
    return this.sesiones.filter(s => {
      const t = s.nombrePaciente.toLowerCase().includes(query) || s.idReserva.toString().includes(query);
      const f = this.filtroActivo === 'todos' || s.clasificacion === this.filtroActivo;
      return t && f;
    });
  }

  obtenerDuracionMinutos(sesion: CardHojaRuta): number {
    const dur = sesion.duracionEntrenamiento || 'PT1H';
    if (dur.includes(':')) {
      const p = dur.split(':');
      return (parseInt(p[0] || '0') * 60) + parseInt(p[1] || '0');
    }
    const m = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    return (parseInt(m?.[1] || '0') * 60) + parseInt(m?.[2] || '0');
  }

  obtenerHoraInicio(sesion: CardHojaRuta): string {
    if (!sesion.fechaCreacion) return '';
    const fecha = new Date(sesion.fechaCreacion);
    return fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  get duracionMinutosModal(): number {
    const dur = this.formularioData?.duracionEntrenamiento || this.sesionSeleccionada?.duracionEntrenamiento || 'PT1H';
    if (dur.includes(':')) {
      const p = dur.split(':');
      return (parseInt(p[0] || '0') * 60) + parseInt(p[1] || '0');
    }
    const m = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    return (parseInt(m?.[1] || '0') * 60) + parseInt(m?.[2] || '0');
  }

  get cargaTiempoActual(): number {
    return this.actividades.reduce((t, a) => t + Number(a.duracionMin || 0), 0);
  }

  get excedeLimite(): boolean { return this.cargaTiempoActual > this.duracionMinutosModal; }
  get minutosExcedidos(): number { return Math.max(this.cargaTiempoActual - this.duracionMinutosModal, 0); }
  get porcentajeCarga(): number { return Math.min((this.cargaTiempoActual / this.duracionMinutosModal) * 100, 100); }
  get actividadesInvalidas(): boolean {
    return this.actividades.some(a => !a.nombre.trim() || Number(a.duracionMin) <= 0);
  }

  abrirModal(sesion: CardHojaRuta): void {
    this.sesionSeleccionada = sesion;
    this.modalAbierto = true;
    this.actividades = [];
    this.errorMessage = '';

    this.hojaRutaService.obtenerFormulario(sesion.idDetalle).subscribe({
      next: (data) => {
        this.formularioData = data;
        this.sedeSeleccionada = data.sedeSeleccionada.nombreSede;
        if (this.actividades.length === 0) {
          this.agregarActividad();
        }
      },
      error: () => { this.errorMessage = 'Error al cargar datos del formulario.'; }
    });

    if (sesion.idRuta) {
      this.hojaRutaService.obtenerEjercicios(sesion.idRuta).subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.actividades = data.map(e => ({
              id: e.idDetalle || Date.now(),
              nombre: e.nombreEjercicio,
              duracionMin: this.parseDuracionMinutos(e.duracionEstimada),
              tipoEjercicio: e.tipoEjercicio,
              descripcion: e.descripcionEjercicio || ''
            }));
          } else {
            this.agregarActividad();
          }
        }
      });
    } else {
      this.agregarActividad();
    }
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.sesionSeleccionada = null;
    this.formularioData = null;
    this.actividades = [];
  }

  agregarActividad(): void {
    this.actividades.push({ id: Date.now(), nombre: '', duracionMin: 10, tipoEjercicio: 'FUERZA', descripcion: '' });
  }

  eliminarActividad(id: number): void {
    if (this.actividades.length === 1) return;
    this.actividades = this.actividades.filter(a => a.id !== id);
  }

  guardarHojaRuta(): void {
    if (!this.sesionSeleccionada?.idRuta || this.actividadesInvalidas || this.excedeLimite) return;
    this.guardando = true;

    const requests = this.actividades.map(a => ({
      idRuta: this.sesionSeleccionada!.idRuta!,
      nombreEjercicio: a.nombre.trim(),
      tipoEjercicio: a.tipoEjercicio,
      descripcionEjercicio: a.descripcion,
      duracionEstimada: `PT${Number(a.duracionMin)}M`
    }));

    let completados = 0;
    const total = requests.length;
    if (total === 0) { this.enviarHojaRuta(); return; }

    requests.forEach(req => {
      this.hojaRutaService.agregarEjercicio(req).subscribe({
        next: () => { completados++; if (completados === total) this.enviarHojaRuta(); },
        error: (err) => { this.errorMessage = err?.error?.message || 'Error al guardar ejercicios.'; this.guardando = false; }
      });
    });
  }

  enviarHojaRuta(): void {
    if (!this.sesionSeleccionada?.idRuta) return;
    this.hojaRutaService.enviarHojaRuta(this.sesionSeleccionada.idRuta).subscribe({
      next: () => {
        this.guardando = false;
        this.exitoMessage = 'Hoja de ruta enviada al tutor.';
        setTimeout(() => this.exitoMessage = '', 3000);
        this.cerrarModal(); this.cargarDatos();
      },
      error: (err) => { this.errorMessage = err?.error?.message || 'Error al enviar la hoja de ruta.'; this.guardando = false; }
    });
  }

  obtenerImagenesSede(): string[] {
    if (!this.formularioData?.sedeSeleccionada) return [];
    const s = this.formularioData.sedeSeleccionada;
    return [s.urlImagenSede1, s.urlImagenSede2, s.urlImagenSede3].filter(Boolean);
  }

  obtenerTituloEstado(sesion: CardHojaRuta): string {
    switch (sesion.clasificacion) {
      case 'por_configurar': return 'Sin actividades asignadas';
      case 'completado': return 'Hoja Completada';
      case 'con_observacion': return 'Feedback del Tutor';
      default: return 'Sin actividades asignadas';
    }
  }

  obtenerDescripcionEstado(sesion: CardHojaRuta): string {
    switch (sesion.clasificacion) {
      case 'por_configurar': return 'Trazar objetivos técnicos para esta sesión.';
      case 'completado': return 'Configuración de rutina de ejercicios';
      case 'con_observacion': return 'El tutor solicitó ajustes en la hoja.';
      default: return '';
    }
  }

  private parseDuracionMinutos(iso: string): number {
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    return (parseInt(m?.[1] || '0') * 60) + parseInt(m?.[2] || '0');
  }
}