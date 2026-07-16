import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { TutorApiService } from '../../services/tutor-api.service';
import { PacienteDto } from '../../models/paciente.model';
import { InstructorPerfilResumenDto } from '../../models/instructor-perfil.model';
import { InstructorPerfilSedeDto } from '../../models/instructor-perfil-sede.model';
import { InstructorPerfilServicioDto } from '../../models/instructor-perfil-servicio.model';

interface HorarioReserva {
  diaSemana: string; fechaNumero: number; mesNombre: string;
  horarioInicio: string; horarioFinal: string; horarioPreferencia: string;
}

interface SesionAgregada {
  diaSemana: string; fechaNumero: number; mesNombre: string;
  horaInicio: string; duracion: number; subtotal: number;
  sedeNombre: string; sedeDireccion: string; sedeImagen: string;
}

@Component({
  selector: 'app-formulario-reserva',
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-reserva.component.html',
  styleUrls: ['./formulario-reserva.component.scss']
})
export class FormularioReserva implements OnInit {
  idInstructor!: number; idPaciente!: number;
  resumen: InstructorPerfilResumenDto | null = null;
  sedes: InstructorPerfilSedeDto[] = []; servicios: InstructorPerfilServicioDto[] = []; pacientes: PacienteDto[] = [];
  sedeSeleccionada: InstructorPerfilSedeDto | null = null;
  tarifaHora = 0; duracionSeleccionada = 1.0; duraciones = [1.0, 1.5, 2.0];
  sesionesAgregadas: SesionAgregada[] = []; horasTotales = 0; montoTotal = 0;
  diasDisponibles: HorarioReserva[] = []; diasPaginados: HorarioReserva[] = [];
  diaSeleccionado: HorarioReserva | null = null; horasDisponibles: string[] = []; horaInicioSeleccionada = '';
  paginaActual = 0; pageSize = 3;
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  mesIndex = new Date().getMonth(); anio = new Date().getFullYear();
  mesSeleccionado = `${this.anio}-${String(this.mesIndex + 1).padStart(2, '0')}`;
  aceptaTerminos = false; cargando = true; guardando = false; validando = false;
  mostrarModal = false; mostrarAlerta = false; mostrarConfirmacion = false; alertaMensaje = '';
  private nombresDias: Record<number, string> = {
    0: 'Domingo',
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado'
  };
  constructor(private route: ActivatedRoute, private router: Router, private tutorApiService: TutorApiService) { }

  ngOnInit(): void {
    this.idInstructor = Number(this.route.snapshot.queryParamMap.get('idInstructor'));
    if (!this.idInstructor) { this.cargando = false; return; }
    this.cargarDatosReserva();
  }

  cargarDatosReserva(): void {
    this.cargando = true;
    const idTutor = this.obtenerIdTutorSesion();
    if (!idTutor) { this.cargando = false; return; }
    forkJoin({
      resumen: this.tutorApiService.getPerfilInstructorResumen(this.idInstructor),
      sedes: this.tutorApiService.getPerfilInstructorSedes(this.idInstructor),
      servicios: this.tutorApiService.getPerfilInstructorServicios(this.idInstructor),
      pacientes: this.tutorApiService.getPacientesPorTutor(idTutor)
    }).subscribe({
      next: (r) => {
        this.resumen = r.resumen; this.sedes = r.sedes || []; this.servicios = r.servicios || [];
        this.pacientes = r.pacientes || []; this.sedeSeleccionada = this.sedes[0] || null;
        this.idPaciente = this.pacientes[0]?.idPaciente; this.tarifaHora = Number(this.servicios[0]?.tarifaHora || 0);
        this.generarCalendario(); this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  obtenerIdTutorSesion(): number | null {
    const raw = localStorage.getItem('authUser_tutor') || localStorage.getItem('authUser');
    if (!raw) return null;
    try { const user = JSON.parse(raw); return Number(user.idTutor || user.tutor?.idTutor || user.id_tutor || user.id); }
    catch { return null; }
  }

  cambiarMes(): void { const [a, m] = this.mesSeleccionado.split('-'); this.anio = +a; this.mesIndex = +m - 1; this.paginaActual = 0; this.generarCalendario(); }

  generarCalendario(): void {
    this.diasDisponibles = [];
    this.diasPaginados = [];
    this.diaSeleccionado = null;
    this.horasDisponibles = [];
    this.horaInicioSeleccionada = '';

    console.log('SERVICIOS RECIBIDOS DEL BACKEND:', this.servicios);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const totalDias = new Date(this.anio, this.mesIndex + 1, 0).getDate();

    for (let d = 1; d <= totalDias; d++) {
      const fecha = new Date(this.anio, this.mesIndex, d);
      fecha.setHours(0, 0, 0, 0);

      if (fecha < hoy) {
        continue;
      }

      const nombreDiaCalendario = this.nombresDias[fecha.getDay()];

      const horario = this.servicios.find(servicio => {
        const diaServicio = this.normalizarDia(servicio.diaSemana || '');
        const diaCalendario = this.normalizarDia(nombreDiaCalendario);

        return diaServicio === diaCalendario;
      });

      if (horario) {
        this.diasDisponibles.push({
          diaSemana: nombreDiaCalendario,
          fechaNumero: d,
          mesNombre: this.meses[this.mesIndex],
          horarioInicio: horario.horarioInicio || '',
          horarioFinal: horario.horarioFinal || '',
          horarioPreferencia: horario.horarioPreferencia || ''
        });
      }
    }

    console.log('DÍAS DISPONIBLES GENERADOS:', this.diasDisponibles);

    this.actualizarPaginacion();
  }

  private normalizarDia(dia: string): string {
    return dia
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
  private obtenerNombreDia(numeroDia: number): string {
    const dias: Record<number, string> = {
      0: 'Domingo',
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado'
    };

    return dias[numeroDia];
  }

  private coincideDiaServicio(diaServicio: string | null | undefined, nombreDiaCalendario: string): boolean {
    if (!diaServicio) {
      return false;
    }

    const diasServicio = diaServicio
      .split(',')
      .map(dia => this.normalizarDia(dia.trim()));

    const diaCalendario = this.normalizarDia(nombreDiaCalendario);

    return diasServicio.includes(diaCalendario);
  }

  actualizarPaginacion(): void {
    const inicio = this.paginaActual * this.pageSize;

    this.diasPaginados = this.diasDisponibles.slice(
      inicio,
      inicio + this.pageSize
    );

    if (this.diasPaginados.length > 0) {
      this.seleccionarDia(this.diasPaginados[0]);
    }
  }

  seleccionarDia(dia: HorarioReserva): void {
    this.diaSeleccionado = dia;
    this.horasDisponibles = this.generarIntervalos(dia.horarioInicio, dia.horarioFinal);
    this.horaInicioSeleccionada = this.horasDisponibles.length > 0 ? this.horasDisponibles[0] : '';
    this.mostrarAlerta = false;
  }

  generarIntervalos(inicio: string, fin: string): string[] {
    const intervalos: string[] = [];
    const [hInicio, mInicio] = inicio.split(':').map(Number);
    const [hFin, mFin] = fin.split(':').map(Number);
    const horaFinMinutos = hFin * 60 + (mFin || 0);
    const duracionMinimaMinutos = Math.min(...this.duraciones) * 60; // ✅ Usar la duración mínima disponible
    let hora = hInicio;
    let minuto = mInicio || 0;

    while (hora < hFin || (hora === hFin && minuto < mFin)) {
      const horaActualMinutos = hora * 60 + minuto;
      const minutosRestantes = horaFinMinutos - horaActualMinutos;
      // ✅ Solo mostrar horas donde quepa al menos la duración mínima
      if (minutosRestantes >= duracionMinimaMinutos) {
        intervalos.push(`${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`);
      }
      minuto += 30;
      if (minuto >= 60) { hora++; minuto = 0; }
    }
    return intervalos;
  }

  esDuracionValida(d: number): boolean {
    if (!this.horaInicioSeleccionada || !this.diaSeleccionado) return false;
    const minutosRestantes = this.horaAMinutos(this.diaSeleccionado.horarioFinal) - this.horaAMinutos(this.horaInicioSeleccionada);
    return (d * 60) <= minutosRestantes;
  }

  horaAMinutos(h: string): number { const [hh, mm] = h.split(':').map(Number); return hh * 60 + (mm || 0); }
  esDiaAgregado(dia: HorarioReserva): boolean { return this.sesionesAgregadas.some(s => s.fechaNumero === dia.fechaNumero && s.mesNombre === dia.mesNombre); }
  esSedeSeleccionada(s: InstructorPerfilSedeDto): boolean { return this.sedeSeleccionada?.idSede === s.idSede; }
  seleccionarSede(s: InstructorPerfilSedeDto): void { this.sedeSeleccionada = s; }
  get tarifaActual(): number { return this.tarifaHora * this.duracionSeleccionada; }

  validarYAgregarSesion(): void {
    if (!this.diaSeleccionado || !this.horaInicioSeleccionada || !this.esDuracionValida(this.duracionSeleccionada) || !this.sedeSeleccionada) return;
    this.validando = true;
    const [hora, minutos] = this.horaInicioSeleccionada.split(':').map(Number);
    const a = this.anio; const m = this.mesIndex + 1; const d = this.diaSeleccionado.fechaNumero;
    const fechaISO = `${a}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(hora).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:00`;
    const durMin = Math.round(this.duracionSeleccionada * 60);
    const subtotal = this.tarifaHora * this.duracionSeleccionada;
    const payload = { idPaciente: this.idPaciente, idInstructor: this.idInstructor, idSede: this.sedeSeleccionada!.idSede, montoTotalAcumulado: subtotal, detalles: [{ horaInicioEstimada: fechaISO, duracionMinutos: durMin, montoSubtotal: subtotal }] };

    this.tutorApiService.validarReserva(payload).subscribe({
      next: (response: any) => {
        this.validando = false;
        if (response.success === false) { this.alertaMensaje = response.message || 'Horario no disponible.'; this.mostrarAlerta = true; return; }
        this.sesionesAgregadas.push({ diaSemana: this.diaSeleccionado!.diaSemana, fechaNumero: d, mesNombre: this.diaSeleccionado!.mesNombre, horaInicio: this.horaInicioSeleccionada, duracion: this.duracionSeleccionada, subtotal, sedeNombre: this.sedeSeleccionada!.nombreSede || 'Sede sin nombre', sedeDireccion: this.sedeSeleccionada!.direccionSede || 'Dirección no registrada', sedeImagen: this.obtenerImagenSede(this.sedeSeleccionada!) });
        this.actualizarTotales(); this.mostrarModal = true;
      },
      error: () => { this.validando = false; this.alertaMensaje = 'Error al validar el horario.'; this.mostrarAlerta = true; }
    });
  }

  eliminarSesion(i: number): void { this.sesionesAgregadas.splice(i, 1); this.actualizarTotales(); }
  cerrarModal(): void { this.mostrarModal = false; }
  cerrarConfirmacion(): void {
    this.mostrarConfirmacion = false;
    this.router.navigate(['/tutor/reserva']);
  }
  actualizarTotales(): void { this.horasTotales = this.sesionesAgregadas.reduce((s, x) => s + x.duracion, 0); this.montoTotal = this.sesionesAgregadas.reduce((s, x) => s + x.subtotal, 0); }
  formatearHora(h: string): string { if (!h) return ''; const [hh, mm] = h.split(':').map(Number); const p = hh >= 12 ? 'PM' : 'AM'; const h12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh; return `${h12}:${String(mm).padStart(2, '0')} ${p}`; }
  puedeAgregarSesion(): boolean { return !!(this.diaSeleccionado && this.horaInicioSeleccionada && this.esDuracionValida(this.duracionSeleccionada) && this.sedeSeleccionada && !this.validando); }
  puedeConfirmar(): boolean { return !!(this.idPaciente && this.idInstructor && this.sedeSeleccionada && this.sesionesAgregadas.length > 0 && this.aceptaTerminos && !this.guardando); }

  confirmarReserva(): void {
    if (this.sesionesAgregadas.length === 0) return;
    this.guardando = true;
    const detalles = this.sesionesAgregadas.map(s => { const [h, m] = s.horaInicio.split(':').map(Number); return { horaInicioEstimada: `${this.anio}-${String(this.mesIndex + 1).padStart(2, '0')}-${String(s.fechaNumero).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`, duracionMinutos: Math.round(s.duracion * 60), montoSubtotal: s.subtotal }; });
    this.tutorApiService.crearReserva({ idPaciente: this.idPaciente, idInstructor: this.idInstructor, idSede: this.sedeSeleccionada!.idSede, montoTotalAcumulado: this.montoTotal, detalles }).subscribe({
      next: () => {
        this.guardando = false;
        this.mostrarConfirmacion = true;
      },
      error: (err: any) => { this.guardando = false; this.alertaMensaje = err.error?.message || 'Error.'; this.mostrarAlerta = true; }
    });
  }

  cerrarAlerta(): void { this.mostrarAlerta = false; }
  cancelar(): void { this.router.navigate(['/tutor/catalogo-instructor']); }
  obtenerImagenInstructor(): string { return this.resumen?.urlImagenPerfil || 'https://via.placeholder.com/300x300?text=Instructor'; }
  obtenerImagenSede(s: InstructorPerfilSedeDto): string { return s.urlImagenSede1 || 'https://via.placeholder.com/300x200?text=Sede'; }
}