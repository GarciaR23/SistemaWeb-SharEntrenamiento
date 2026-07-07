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
  diaSemana: string | null;
  horarioInicio: string | null;
  horarioFinal: string | null;
  horarioPreferencia?: string | null;
}

@Component({
  selector: 'app-reserva-sesion',
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-sesion.component.html',
  styleUrls: ['./reserva-sesion.component.scss']
})
export class ReservaSesion implements OnInit {
  idInstructor!: number;
  idPaciente!: number;

  resumen: InstructorPerfilResumenDto | null = null;
  sedes: InstructorPerfilSedeDto[] = [];
  servicios: InstructorPerfilServicioDto[] = [];
  pacientes: PacienteDto[] = [];

  sedeSeleccionada: InstructorPerfilSedeDto | null = null;
  horarioSeleccionado: HorarioReserva | null = null;

  horariosDisponibles: HorarioReserva[] = [];

  tarifaHora = 0;
  duracionHoras = 1;
  montoTotal = 0;

  aceptaTerminos = false;
  cargando = true;
  guardando = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tutorApiService: TutorApiService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.queryParamMap.get('idInstructor'));

    if (!id) {
      this.errorMessage = 'Instructor no válido para realizar la reserva.';
      this.cargando = false;
      return;
    }

    this.idInstructor = id;
    this.cargarDatosReserva();
  }

  cargarDatosReserva(): void {
    this.cargando = true;
    this.errorMessage = '';

    const idTutor = this.obtenerIdTutorSesion();

    if (!idTutor) {
      this.errorMessage = 'No se pudo identificar al tutor autenticado.';
      this.cargando = false;
      return;
    }

    forkJoin({
      resumen: this.tutorApiService.getPerfilInstructorResumen(this.idInstructor),
      sedes: this.tutorApiService.getPerfilInstructorSedes(this.idInstructor),
      servicios: this.tutorApiService.getPerfilInstructorServicios(this.idInstructor),
      pacientes: this.tutorApiService.getPacientesPorTutor(idTutor)
    }).subscribe({
      next: (response) => {
        this.resumen = response.resumen;
        this.sedes = response.sedes || [];
        this.servicios = response.servicios || [];
        this.pacientes = response.pacientes || [];

        this.sedeSeleccionada = this.sedes[0] || null;
        this.idPaciente = this.pacientes[0]?.idPaciente;

        this.tarifaHora = Number(this.servicios[0]?.tarifaHora || 0);
        this.horariosDisponibles = this.obtenerHorariosDesdeServicios(this.servicios);
        this.horarioSeleccionado = this.horariosDisponibles[0] || null;
        console.log('Servicios recibidos:', this.servicios);
        console.log('Horarios disponibles:', this.horariosDisponibles);
        console.log('Horario seleccionado:', this.horarioSeleccionado);
        this.calcularMonto();

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar datos de reserva:', err);
        this.errorMessage = 'No se pudo cargar la información para reservar.';
        this.cargando = false;
      }
    });
  }

  obtenerIdTutorSesion(): number | null {
    const authUserTutor = localStorage.getItem('authUser_tutor');
    const authUser = localStorage.getItem('authUser');

    const raw = authUserTutor || authUser;

    if (!raw) {
      return null;
    }

    try {
      const user = JSON.parse(raw);

      return Number(
        user.idTutor ||
        user.tutor?.idTutor ||
        user.id_tutor ||
        user.id
      );
    } catch {
      return null;
    }
  }

  obtenerHorariosDesdeServicios(servicios: any[]): HorarioReserva[] {
    const horarios: HorarioReserva[] = [];

    servicios.forEach(servicio => {
      if (servicio.horarios && Array.isArray(servicio.horarios)) {
        servicio.horarios.forEach((h: any) => {
          horarios.push({
            diaSemana: h.diaSemana || h.diaDisponible || h.dia_semana || null,
            horarioInicio: h.horarioInicio || h.horario_inicio || null,
            horarioFinal: h.horarioFinal || h.horario_final || null,
            horarioPreferencia: h.horarioPreferencia || h.horario_preferencia || null
          });
        });
      }

      if (
        servicio.diaSemana ||
        servicio.diaDisponible ||
        servicio.dia_semana ||
        servicio.horarioInicio ||
        servicio.horario_inicio ||
        servicio.horarioFinal ||
        servicio.horario_final
      ) {
        horarios.push({
          diaSemana: servicio.diaSemana || servicio.diaDisponible || servicio.dia_semana || null,
          horarioInicio: servicio.horarioInicio || servicio.horario_inicio || null,
          horarioFinal: servicio.horarioFinal || servicio.horario_final || null,
          horarioPreferencia: servicio.horarioPreferencia || servicio.horario_preferencia || null
        });
      }
    });

    return horarios.filter(h => h.diaSemana && h.horarioInicio && h.horarioFinal);
  }

  seleccionarSede(sede: InstructorPerfilSedeDto): void {
    this.sedeSeleccionada = sede;
  }

  seleccionarHorario(horario: HorarioReserva): void {
    this.horarioSeleccionado = horario;
  }

  seleccionarDuracion(horas: number): void {
    if (!this.duracionDisponible(horas)) {
      return;
    }

    this.duracionHoras = horas;
    this.calcularMonto();
  }

  calcularMonto(): void {
    this.montoTotal = this.tarifaHora * this.duracionHoras;
  }

  calcularMinutosDisponibles(): number {
    if (!this.horarioSeleccionado?.horarioInicio || !this.horarioSeleccionado?.horarioFinal) {
      return 0;
    }

    const [horaInicio, minutoInicio] = this.horarioSeleccionado.horarioInicio
      .split(':')
      .map(Number);

    const [horaFinal, minutoFinal] = this.horarioSeleccionado.horarioFinal
      .split(':')
      .map(Number);

    const inicioEnMinutos = horaInicio * 60 + minutoInicio;
    const finalEnMinutos = horaFinal * 60 + minutoFinal;

    return finalEnMinutos - inicioEnMinutos;
  }

  duracionSeleccionadaMinutos(): number {
    return Math.round(this.duracionHoras * 60);
  }

  duracionDisponible(horas: number): boolean {
    const minutosSolicitados = Math.round(horas * 60);
    return this.calcularMinutosDisponibles() >= minutosSolicitados;
  }

  duracionPermitida(): boolean {
    return this.duracionDisponible(this.duracionHoras);
  }

  mensajeDuracionNoPermitida(): string {
    const disponibles = this.calcularMinutosDisponibles();

    if (!this.horarioSeleccionado) {
      return 'Primero selecciona un horario disponible.';
    }

    return `Este horario solo tiene ${disponibles} minutos disponibles. Selecciona una duración menor.`;
  }

  puedeConfirmar(): boolean {
    return !!(
      this.idPaciente &&
      this.idInstructor &&
      this.sedeSeleccionada &&
      this.horarioSeleccionado &&
      this.duracionPermitida() &&
      this.aceptaTerminos &&
      !this.guardando
    );
  }

  confirmarReserva(): void {
    if (!this.idPaciente) {
      this.errorMessage = 'No se encontró un paciente asociado al tutor.';
      return;
    }

    if (!this.sedeSeleccionada) {
      this.errorMessage = 'Selecciona una sede para la sesión.';
      return;
    }

    if (!this.horarioSeleccionado) {
      this.errorMessage = 'Selecciona un horario disponible.';
      return;
    }

    if (!this.duracionPermitida()) {
      this.errorMessage = this.mensajeDuracionNoPermitida();
      return;
    }

    if (!this.aceptaTerminos) {
      this.errorMessage = 'Debes aceptar los términos de servicio.';
      return;
    }

    this.guardando = true;
    this.errorMessage = '';

    const fechaReserva = this.construirFechaReserva();

    if (!fechaReserva) {
      this.errorMessage = 'No se pudo construir la fecha de la reserva según el horario seleccionado.';
      this.guardando = false;
      return;
    }

    const duracionMinutos = this.duracionSeleccionadaMinutos();

    this.tutorApiService.crearReserva({
      idPaciente: this.idPaciente,
      idInstructor: this.idInstructor,
      idSede: this.sedeSeleccionada.idSede,
      seleccionHorario: fechaReserva,
      duracionMinutos,
      montoTotal: this.montoTotal
    }).subscribe({
      next: () => {
        this.guardando = false;

        this.router.navigate(['/tutor/sesion'], {
          queryParams: {
            reservaCreada: 'true',
            idPaciente: this.idPaciente
          }
        });
      },
      error: (err) => {
        console.error('Error al confirmar reserva:', err);
        this.guardando = false;
        this.errorMessage = 'No se pudo registrar la reserva. Verifica los datos seleccionados.';
      }
    });
  }

  construirFechaReserva(): string {
    if (!this.horarioSeleccionado) {
      console.error('No hay horario seleccionado');
      return '';
    }

    const diaSemana = this.horarioSeleccionado.diaSemana;
    const horaInicio = this.horarioSeleccionado.horarioInicio;

    if (!diaSemana || !horaInicio) {
      console.error('Horario incompleto:', this.horarioSeleccionado);
      return '';
    }

    const fechaReserva = this.obtenerProximaFechaPorDia(diaSemana);

    const [hora, minuto] = horaInicio.split(':').map(Number);

    fechaReserva.setHours(hora, minuto, 0, 0);

    return this.formatearFechaLocal(fechaReserva);
  }

  obtenerProximaFechaPorDia(diaSemana: string): Date {
    const hoy = new Date();

    const diaObjetivo = this.obtenerNumeroDiaSemana(diaSemana);
    const diaActual = hoy.getDay();

    let diasParaSumar = diaObjetivo - diaActual;

    if (diasParaSumar < 0) {
      diasParaSumar += 7;
    }

    if (diasParaSumar === 0 && this.horarioSeleccionado?.horarioInicio) {
      const [hora, minuto] = this.horarioSeleccionado.horarioInicio.split(':').map(Number);

      const fechaHoyConHorario = new Date();
      fechaHoyConHorario.setHours(hora, minuto, 0, 0);

      if (fechaHoyConHorario.getTime() <= hoy.getTime()) {
        diasParaSumar = 7;
      }
    }

    const fecha = new Date();
    fecha.setDate(hoy.getDate() + diasParaSumar);

    return fecha;
  }

  obtenerNumeroDiaSemana(diaSemana: string): number {
    const diaNormalizado = this.normalizarTexto(diaSemana);

    if (diaNormalizado.includes('domingo') || diaNormalizado === 'd') {
      return 0;
    }

    if (diaNormalizado.includes('lunes') || diaNormalizado === 'l') {
      return 1;
    }

    if (diaNormalizado.includes('martes') || diaNormalizado === 'm') {
      return 2;
    }

    if (diaNormalizado.includes('miercoles') || diaNormalizado === 'mi') {
      return 3;
    }

    if (diaNormalizado.includes('jueves') || diaNormalizado === 'j') {
      return 4;
    }

    if (diaNormalizado.includes('viernes') || diaNormalizado === 'v') {
      return 5;
    }

    if (diaNormalizado.includes('sabado') || diaNormalizado === 's') {
      return 6;
    }

    return new Date().getDay();
  }

  normalizarTexto(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  formatearFechaLocal(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    const seconds = String(fecha.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  cancelar(): void {
    this.router.navigate(['/tutor/catalogo-instructor']);
  }

  obtenerImagenInstructor(): string {
    return this.resumen?.urlImagenPerfil || 'https://via.placeholder.com/300x300?text=Instructor';
  }

  obtenerImagenSede(sede: InstructorPerfilSedeDto): string {
    return sede.urlImagenSede1 || 'https://via.placeholder.com/300x200?text=Sede';
  }

  formatearHorario(horario: HorarioReserva): string {
    const inicio = horario.horarioInicio?.substring(0, 5) || '--:--';
    const fin = horario.horarioFinal?.substring(0, 5) || '--:--';

    return `${inicio} - ${fin}`;
  }
}