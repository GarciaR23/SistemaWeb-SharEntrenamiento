import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import {
  ActividadTutorDto,
  PropuestaReprogramacionDto,
  ReporteTecnicoDto
} from '../../models/actividad-tutor.model';

import { TutorApiService } from '../../services/tutor-api.service';

type FiltroActividad =
  'en_curso' |
  'reprogramado' |
  'finalizado';

type TipoIncidenciaUI =
  'impuntualidad' |
  'mal_trato' |
  'incidente_menor' |
  'colapso_paciente';

type NivelGravedad =
  'baja' |
  'moderada' |
  'critica';

@Component({
  selector: 'app-actividad-paciente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './actividad-paciente.html',
  styleUrl: './actividad-paciente.scss',
})
export class ActividadPaciente implements OnInit, OnDestroy {

  actividades: ActividadTutorDto[] = [];

  filtroActual: FiltroActividad = 'en_curso';

  cargando = false;

  modalPinAbierto = false;
  modalPagoAbierto = false;
  modalReprogramacionAbierto = false;
  modalReporteAbierto = false;

  modalTiposIncidenciaAbierto = false;
  modalReporteIncidenciaAbierto = false;
  modalProtocoloEmergenciaAbierto = false;

  actividadSeleccionada: ActividadTutorDto | null = null;
  propuestaSeleccionada: PropuestaReprogramacionDto | null = null;
  reporteSeleccionado: ReporteTecnicoDto | null = null;

  tipoIncidenciaSeleccionado: TipoIncidenciaUI | null = null;
  severidadSeleccionada: NivelGravedad | null = null;
  archivosEvidencia: File[] = [];

  calificacionSeleccionada = 0;
  hoverCalificacion = 0;

  progresoProtocoloPorcentaje = 0;
  minutosTranscurridosProtocolo = 0;

  pinControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{4}$/)
  ]);

  comentarioPagoControl = new FormControl('');

  formularioIncidencia = new FormGroup({
    descripcion: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(500)
    ])
  });

  private intervalos = new Map<number, ReturnType<typeof setInterval>>();

  constructor(
    private tutorApiService: TutorApiService
  ) { }

  ngOnInit(): void {
    this.cargarActividades();
  }

  ngOnDestroy(): void {
    this.intervalos.forEach(intervalo => clearInterval(intervalo));
    this.intervalos.clear();
  }

  get descripcionControl(): FormControl {
    return this.formularioIncidencia.get('descripcion') as FormControl;
  }

  cargarActividades(): void {
    const usuario = this.obtenerUsuarioSesion();

    if (!usuario) {
      return;
    }

    if (usuario.idTutor) {
      this.cargarActividadesPorTutor(usuario.idTutor);
      return;
    }

    if (usuario.idUsuario) {
      this.tutorApiService
        .getTutorPorUsuario(usuario.idUsuario)
        .subscribe({
          next: tutor => {
            this.cargarActividadesPorTutor(tutor.idTutor);
          },
          error: error => console.error(error)
        });
    }
  }

  cargarActividadesPorTutor(idTutor: number): void {
    this.cargando = true;

    this.tutorApiService
      .getActividadesTutor(idTutor)
      .subscribe({
        next: actividades => {
          this.actividades = actividades.map(actividad => {
            const segundos = this.calcularSegundosRestantes(actividad);

            return {
              ...actividad,
              mostrarAsistencia: false,
              segundosRestantes: segundos,
              tiempoCumplido:
                actividad.estadoSesion === 'finalizado' ||
                actividad.pagoRegistrado ||
                (
                  actividad.estadoSesion === 'en_curso' &&
                  segundos <= 0
                )
            };
          });

          this.restaurarCronometros();
          this.cargando = false;
        },
        error: error => {
          console.error(error);
          this.cargando = false;
        }
      });
  }

  get actividadesVisibles(): ActividadTutorDto[] {
    if (this.filtroActual === 'en_curso') {
      return this.actividades.filter(actividad =>
        actividad.estadoSesion === 'programada' ||
        actividad.estadoSesion === 'pendiente' ||
        actividad.estadoSesion === 'en_curso'
      );
    }

    if (this.filtroActual === 'reprogramado') {
      return this.actividades.filter(actividad =>
        actividad.estadoSesion === 'reprogramada'
      );
    }

    return this.actividades.filter(actividad =>
      actividad.estadoSesion === 'finalizado'
    );
  }

  get contadorPendiente(): number {
    return this.actividades.filter(actividad =>
      actividad.estadoSesion === 'programada' ||
      actividad.estadoSesion === 'pendiente'
    ).length;
  }

  get contadorEnCurso(): number {
    return this.actividades.filter(actividad =>
      actividad.estadoSesion === 'en_curso'
    ).length;
  }

  get contadorReprogramado(): number {
    return this.actividades.filter(actividad =>
      actividad.estadoSesion === 'reprogramada'
    ).length;
  }

  get contadorFinalizado(): number {
    return this.actividades.filter(actividad =>
      actividad.estadoSesion === 'finalizado'
    ).length;
  }

  cambiarFiltro(filtro: FiltroActividad): void {
    this.filtroActual = filtro;
  }

  puedeEmpezar(actividad: ActividadTutorDto): boolean {
    if (!actividad.hojaRutaAceptada) {
      return false;
    }

    if (
      actividad.estadoSesion !== 'programada' &&
      actividad.estadoSesion !== 'pendiente'
    ) {
      return false;
    }

    const ahora = Date.now();
    const inicio = new Date(actividad.horaInicioEstimada).getTime();
    const limite = inicio + 10 * 60 * 1000;

    return ahora >= inicio && ahora <= limite;
  }

  mensajeBotonEmpezar(actividad: ActividadTutorDto): string {
    const ahora = Date.now();
    const inicio = new Date(actividad.horaInicioEstimada).getTime();
    const limite = inicio + 10 * 60 * 1000;

    if (ahora < inicio) {
      return 'Disponible a la hora programada';
    }

    if (ahora > limite) {
      return 'Tolerancia vencida';
    }

    return 'Empezar';
  }

  empezarActividad(actividad: ActividadTutorDto): void {
    if (!this.puedeEmpezar(actividad)) {
      return;
    }

    actividad.mostrarAsistencia = true;
  }

  abrirModalPin(actividad: ActividadTutorDto): void {
    this.actividadSeleccionada = actividad;
    this.pinControl.reset();
    this.modalPinAbierto = true;
  }

  cerrarModalPin(): void {
    this.modalPinAbierto = false;
    this.pinControl.reset();
    this.actividadSeleccionada = null;
  }

  confirmarPin(): void {
    if (
      !this.actividadSeleccionada ||
      this.pinControl.invalid
    ) {
      this.pinControl.markAsTouched();
      return;
    }

    const actividad = this.actividadSeleccionada;
    const pin = this.pinControl.value || '';

    this.tutorApiService
      .iniciarActividad(
        actividad.idDetalle,
        pin
      )
      .subscribe({
        next: actividadActualizada => {
          const actualizada: ActividadTutorDto = {
            ...actividadActualizada,
            mostrarAsistencia: false,
            segundosRestantes: this.calcularSegundosRestantes(actividadActualizada),
            tiempoCumplido: false
          };

          this.reemplazarActividad(actualizada);
          this.iniciarCronometro(actualizada);
          this.cerrarModalPin();
        },
        error: error => {
          console.error(error);
          this.pinControl.setErrors({
            pinIncorrecto: true
          });
        }
      });
  }

  abrirSelectorIncidencia(actividad: ActividadTutorDto): void {
    this.actividadSeleccionada = actividad;
    this.tipoIncidenciaSeleccionado = null;
    this.severidadSeleccionada = null;
    this.archivosEvidencia = [];
    this.formularioIncidencia.reset();

    this.modalTiposIncidenciaAbierto = true;
    this.modalReporteIncidenciaAbierto = false;
    this.modalProtocoloEmergenciaAbierto = false;
  }

  cerrarSelectorIncidencia(): void {
    this.modalTiposIncidenciaAbierto = false;
    this.tipoIncidenciaSeleccionado = null;
  }

  seleccionarTipoIncidencia(tipo: TipoIncidenciaUI): void {
    this.tipoIncidenciaSeleccionado = tipo;

    if (tipo === 'colapso_paciente') {
      if (this.actividadSeleccionada) {
        this.calcularProgresoProtocolo(this.actividadSeleccionada);
      }

      this.modalTiposIncidenciaAbierto = false;
      this.modalReporteIncidenciaAbierto = false;
      this.modalProtocoloEmergenciaAbierto = true;
      return;
    }

    this.modalTiposIncidenciaAbierto = false;
    this.modalProtocoloEmergenciaAbierto = false;
    this.modalReporteIncidenciaAbierto = true;
  }

  seleccionarSeveridad(nivel: NivelGravedad): void {
    this.severidadSeleccionada = nivel;
  }

  cerrarReporteIncidencia(): void {
    this.modalReporteIncidenciaAbierto = false;
    this.tipoIncidenciaSeleccionado = null;
    this.severidadSeleccionada = null;
    this.formularioIncidencia.reset();
    this.archivosEvidencia = [];
  }

  onEvidenciasSeleccionadas(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files) {
      return;
    }

    this.archivosEvidencia = Array.from(input.files);
  }

  guardarReporteIncidencia(): void {
    if (
      !this.actividadSeleccionada ||
      !this.tipoIncidenciaSeleccionado
    ) {
      return;
    }

    const actividad = this.actividadSeleccionada;
    const tipo = this.tipoIncidenciaSeleccionado;
    const idSesion = actividad.idSesion;

    if (idSesion === null || idSesion === undefined) {
      console.error('No existe idSesion para registrar incidencia.', actividad);
      return;
    }

    if (
      !this.severidadSeleccionada ||
      this.formularioIncidencia.invalid
    ) {
      this.formularioIncidencia.markAllAsTouched();
      return;
    }

    this.tutorApiService
      .registrarIncidenciaActividad(
        idSesion,
        {
          idPaciente: actividad.idPaciente,
          idInstructor: actividad.idInstructor,
          motivoIncidencia: tipo,
          nivelGravedad: this.severidadSeleccionada,
          descripcionIncidencia: this.descripcionControl.value || '',
          urlEvidencia1: null,
          urlEvidencia2: null,
          urlEvidencia3: null
        }
      )
      .subscribe({
        next: actividadActualizada => {
          this.detenerCronometro(actividad.idDetalle);

          this.reemplazarActividad({
            ...actividadActualizada,
            mostrarAsistencia: false,
            segundosRestantes:
              actividadActualizada.estadoSesion === 'finalizado'
                ? 0
                : actividadActualizada.duracionMinutos * 60,
            tiempoCumplido:
              actividadActualizada.estadoSesion === 'finalizado'
          });

          this.cerrarReporteIncidencia();

          if (tipo === 'colapso_paciente') {
            this.modalProtocoloEmergenciaAbierto = false;
            this.filtroActual = 'finalizado';
          } else {
            this.filtroActual = 'reprogramado';
          }
        },
        error: error => {
          console.error('Error al registrar incidencia:', error);
        }
      });
  }

  cerrarProtocoloEmergencia(): void {
    this.modalProtocoloEmergenciaAbierto = false;
    this.tipoIncidenciaSeleccionado = null;
    this.progresoProtocoloPorcentaje = 0;
    this.minutosTranscurridosProtocolo = 0;
  }

  calcularProgresoProtocolo(actividad: ActividadTutorDto): void {
    const inicio = new Date(actividad.horaInicioEstimada).getTime();
    const fin = new Date(actividad.horaFinEstimada).getTime();
    const ahora = Date.now();

    const duracionTotalMs = fin - inicio;
    const transcurridoMs = ahora - inicio;

    if (duracionTotalMs <= 0 || transcurridoMs <= 0) {
      this.progresoProtocoloPorcentaje = 0;
      this.minutosTranscurridosProtocolo = 0;
      return;
    }

    const porcentaje = Math.round((transcurridoMs / duracionTotalMs) * 100);
    const minutos = Math.floor(transcurridoMs / 60000);

    this.progresoProtocoloPorcentaje = Math.min(porcentaje, 100);
    this.minutosTranscurridosProtocolo = Math.min(
      minutos,
      actividad.duracionMinutos
    );
  }

  obtenerTextoEstadoProtocolo(): string {
    if (this.progresoProtocoloPorcentaje >= 100) {
      return 'Sesión completada';
    }

    return 'Sesión detenida por incidencia';
  }

  activarProtocoloColapso(): void {
    const actividad = this.actividadSeleccionada;

    if (!actividad) {
      console.error('No hay actividad seleccionada para activar protocolo.');
      return;
    }

    if (actividad.idSesion === null || actividad.idSesion === undefined) {
      console.error('La actividad no tiene idSesion. No se puede registrar colapso.', actividad);
      return;
    }

    const idSesion = actividad.idSesion;

    this.tutorApiService
      .registrarIncidenciaActividad(idSesion, {
        idPaciente: actividad.idPaciente,
        idInstructor: actividad.idInstructor,
        motivoIncidencia: 'colapso_paciente',
        nivelGravedad: 'critica',
        descripcionIncidencia:
          this.descripcionControl.value ||
          actividad.protocoloEmergencia ||
          'Se activó el protocolo de emergencia por colapso del paciente.',
        urlEvidencia1: null,
        urlEvidencia2: null,
        urlEvidencia3: null
      })
      .subscribe({
        next: actividadActualizada => {
          this.detenerCronometro(actividad.idDetalle);

          const actividadListaParaPago: ActividadTutorDto = {
            ...actividadActualizada,
            segundosRestantes: 0,
            tiempoCumplido: true,
            mostrarAsistencia: false
          };

          this.reemplazarActividad(actividadListaParaPago);

          this.modalProtocoloEmergenciaAbierto = false;
          this.modalTiposIncidenciaAbierto = false;
          this.modalReporteIncidenciaAbierto = false;

          this.actividadSeleccionada = actividadListaParaPago;
          this.modalPagoAbierto = true;
        },
        error: error => {
          console.error('Error al registrar colapso del paciente:', error);
        }
      });
  }

  abrirModalPago(actividad: ActividadTutorDto): void {
    if (!actividad.tiempoCumplido) {
      return;
    }

    this.actividadSeleccionada = actividad;
    this.calificacionSeleccionada = 0;
    this.hoverCalificacion = 0;
    this.comentarioPagoControl.reset();
    this.modalPagoAbierto = true;
  }

  cerrarModalPago(): void {
    this.modalPagoAbierto = false;
    this.actividadSeleccionada = null;
    this.calificacionSeleccionada = 0;
    this.hoverCalificacion = 0;
    this.comentarioPagoControl.reset();
  }

  seleccionarCalificacion(valor: number): void {
    this.calificacionSeleccionada = valor;
  }

  setHoverCalificacion(valor: number): void {
    this.hoverCalificacion = valor;
  }

  limpiarHoverCalificacion(): void {
    this.hoverCalificacion = 0;
  }

  esEstrellaVisible(valor: number): boolean {
    const referencia =
      this.hoverCalificacion || this.calificacionSeleccionada;

    return valor <= referencia;
  }

  confirmarPago(): void {
    if (!this.actividadSeleccionada) {
      return;
    }

    const actividad = this.actividadSeleccionada;

    this.tutorApiService
      .confirmarPagoActividad(
        actividad.idDetalle,
        {
          metodoPago: 'tarjeta_credito',
          puntajeEstrellas:
            this.calificacionSeleccionada > 0
              ? this.calificacionSeleccionada
              : null,
          comentarioTutor:
            this.comentarioPagoControl.value || null
        }
      )
      .subscribe({
        next: actividadActualizada => {
          this.detenerCronometro(actividad.idDetalle);

          this.reemplazarActividad({
            ...actividadActualizada,
            segundosRestantes: 0,
            tiempoCumplido: true,
            mostrarAsistencia: false
          });

          this.calificacionSeleccionada = 0;
          this.hoverCalificacion = 0;
          this.comentarioPagoControl.reset();

          this.modalPagoAbierto = false;
          this.actividadSeleccionada = null;
          this.filtroActual = 'finalizado';
        },
        error: error => {
          console.error('Error al confirmar pago:', error);
        }
      });
  }

  abrirReprogramacion(actividad: ActividadTutorDto): void {
    this.actividadSeleccionada = actividad;
    this.propuestaSeleccionada = null;
    this.modalReprogramacionAbierto = true;
  }

  cerrarReprogramacion(): void {
    this.modalReprogramacionAbierto = false;
    this.actividadSeleccionada = null;
    this.propuestaSeleccionada = null;
  }

  seleccionarPropuesta(propuesta: PropuestaReprogramacionDto): void {
    this.propuestaSeleccionada = propuesta;
  }

  confirmarReprogramacion(): void {
    if (
      !this.actividadSeleccionada ||
      !this.propuestaSeleccionada
    ) {
      return;
    }

    const actividad = this.actividadSeleccionada;

    this.tutorApiService
      .aceptarReprogramacionActividad(
        actividad.idDetalle,
        this.propuestaSeleccionada.idDetalleReprogramar
      )
      .subscribe({
        next: actividadActualizada => {
          this.reemplazarActividad({
            ...actividadActualizada,
            mostrarAsistencia: false,
            segundosRestantes:
              this.calcularSegundosRestantes(
                actividadActualizada
              ),
            tiempoCumplido: false
          });

          this.cerrarReprogramacion();
          this.filtroActual = 'en_curso';
        },
        error: error => console.error(error)
      });
  }

  abrirReporte(actividad: ActividadTutorDto): void {
    this.actividadSeleccionada = actividad;
    this.reporteSeleccionado = null;
    this.modalReporteAbierto = true;

    this.tutorApiService
      .getReporteActividad(actividad.idReserva)
      .subscribe({
        next: reporte => {
          this.reporteSeleccionado = reporte;
        },
        error: error => {
          console.error('Error al obtener reporte técnico:', error);
          this.reporteSeleccionado = null;
        }
      });
  }

  cerrarReporte(): void {
    this.modalReporteAbierto = false;
    this.actividadSeleccionada = null;
    this.reporteSeleccionado = null;
  }

  async exportarReportePDF(): Promise<void> {
    const elemento = document.getElementById('reporte-tecnico-pdf');

    if (!elemento || !this.reporteSeleccionado) {
      return;
    }

    const canvas = await html2canvas(elemento, {
      scale: 2,
      backgroundColor: '#0b1120',
      useCORS: true
    });

    const imagen = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 20;
    const imgHeight =
      (canvas.height * imgWidth) / canvas.width;

    let position = 10;
    let heightLeft = imgHeight;

    pdf.addImage(
      imagen,
      'PNG',
      10,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(
        imagen,
        'PNG',
        10,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;
    }

    pdf.save(
      `reporte-tecnico-reserva-${this.reporteSeleccionado.idReserva}.pdf`
    );
  }

  formatearTiempo(segundosTotales: number | undefined): string {
    const total = segundosTotales ?? 0;
    const minutos = Math.floor(total / 60);
    const segundos = total % 60;

    return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  }

  formatearFecha(fecha: string | null | undefined): string {
    if (!fecha) {
      return 'Sin fecha';
    }

    return new Date(fecha).toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  formatearHora(fecha: string | null | undefined): string {
    if (!fecha) {
      return '--:--';
    }

    return new Date(fecha).toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  private iniciarCronometro(actividad: ActividadTutorDto): void {
    if (
      this.intervalos.has(actividad.idDetalle) ||
      actividad.tiempoCumplido
    ) {
      return;
    }

    const intervalo = setInterval(() => {
      const segundos = actividad.segundosRestantes ?? 0;

      if (segundos > 0) {
        actividad.segundosRestantes = segundos - 1;
      }

      if ((actividad.segundosRestantes ?? 0) <= 0) {
        this.finalizarTiempoLocal(actividad);
      }
    }, 1000);

    this.intervalos.set(actividad.idDetalle, intervalo);
  }

  private finalizarTiempoLocal(actividad: ActividadTutorDto): void {
    this.detenerCronometro(actividad.idDetalle);

    actividad.segundosRestantes = 0;
    actividad.tiempoCumplido = true;
  }

  private detenerCronometro(idDetalle: number): void {
    const intervalo = this.intervalos.get(idDetalle);

    if (intervalo) {
      clearInterval(intervalo);
      this.intervalos.delete(idDetalle);
    }
  }

  private restaurarCronometros(): void {
    this.actividades
      .filter(actividad =>
        actividad.estadoSesion === 'en_curso' &&
        !actividad.tiempoCumplido
      )
      .forEach(actividad => this.iniciarCronometro(actividad));
  }

  private calcularSegundosRestantes(actividad: ActividadTutorDto): number {
    if (actividad.estadoSesion !== 'en_curso') {
      return actividad.duracionMinutos * 60;
    }

    const fin = new Date(actividad.horaFinEstimada).getTime();
    const diferencia = Math.floor((fin - Date.now()) / 1000);

    return Math.max(diferencia, 0);
  }

  private reemplazarActividad(actualizada: ActividadTutorDto): void {
    const index = this.actividades.findIndex(
      actividad => actividad.idDetalle === actualizada.idDetalle
    );

    if (index >= 0) {
      this.actividades[index] = {
        ...this.actividades[index],
        ...actualizada
      };
      return;
    }

    this.actividades.unshift(actualizada);
  }

  private obtenerUsuarioSesion(): {
    idTutor?: number;
    idUsuario?: number;
  } | null {
    const raw =
      localStorage.getItem('authUser_tutor') ||
      localStorage.getItem('authUser');

    if (!raw) {
      return null;
    }

    try {
      const usuario = JSON.parse(raw);

      return {
        idTutor: Number(
          usuario.idTutor ||
          usuario.tutor?.idTutor ||
          usuario.id_tutor
        ) || undefined,

        idUsuario: Number(
          usuario.idUsuario ||
          usuario.id_usuario ||
          usuario.id
        ) || undefined
      };

    } catch {
      return null;
    }
  }

}