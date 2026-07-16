import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  AjusteHojaRutaRequest,
  DetalleRutinaPlanDto,
  PlanTutorDto
} from '../../models/plan-tutor.model';

import { PlanApiService } from '../../services/plan-api.service';

type PlanTab = 'ruta' | 'ajuste';

@Component({
  selector: 'app-plan-paciente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './plan-paciente.html',
  styleUrl: './plan-paciente.scss'
})
export class PlanPaciente implements OnInit {

  idReserva = 0;
  plan: PlanTutorDto | null = null;
  planes: PlanTutorDto[] = [];

  cargando = false;
  enviandoAjuste = false;
  aceptando = false;

  tabActiva: PlanTab = 'ruta';

  modalAjusteAbierto = false;

  formularioAjuste = new FormGroup({
    motivoCambio: new FormControl('', [
      Validators.required
    ]),
    motivoDetallado: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(700)
    ]),
    idEjercicioOriginal: new FormControl<number | null>(null, [
      Validators.required
    ]),
    ejercicioModificado: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(700)
    ])
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private planApiService: PlanApiService
  ) { }

  ngOnInit(): void {
    const rawId = this.route.snapshot.paramMap.get('idReserva');
    this.idReserva = Number(rawId);

    console.log('ID RESERVA RECIBIDO EN PLAN:', this.idReserva);

    if (this.idReserva) {
      this.cargarPlan();
      return;
    }

    this.cargarPlanesTutor();
  }

  get motivoCambioControl(): FormControl {
    return this.formularioAjuste.get('motivoCambio') as FormControl;
  }

  get motivoDetalladoControl(): FormControl {
    return this.formularioAjuste.get('motivoDetallado') as FormControl;
  }

  get idEjercicioOriginalControl(): FormControl {
    return this.formularioAjuste.get('idEjercicioOriginal') as FormControl;
  }

  get ejercicioModificadoControl(): FormControl {
    return this.formularioAjuste.get('ejercicioModificado') as FormControl;
  }

  cargarPlan(): void {
    this.cargando = true;

    console.log('CONSULTANDO PLAN DE RESERVA:', this.idReserva);

    this.planApiService
      .getPlanPorReserva(this.idReserva)
      .subscribe({
        next: plan => {
          console.log('PLAN RECIBIDO:', plan);

          this.plan = plan;
          this.cargando = false;

          if (plan.estadoHoja === 'enviado_al_tutor') {
            this.marcarComoVisto();
          }
        },
        error: error => {
          console.error('ERROR CARGANDO PLAN:', error);
          this.cargando = false;
        }
      });
  }

  cargarPlanesTutor(): void {
    this.cargando = true;

    console.log('PROBANDO PLANES CON ID_TUTOR 7');

    this.planApiService
      .getPlanesPorTutor(7)
      .subscribe({
        next: planes => {
          console.log('PLANES RECIBIDOS TUTOR 7:', planes);

          this.planes = planes;
          this.cargando = false;

          if (planes.length === 1) {
            this.seleccionarPlan(planes[0]);
          }
        },
        error: error => {
          console.error('ERROR CARGANDO PLANES TUTOR 7:', error);
          this.cargando = false;
        }
      });
  }

  seleccionarPlan(plan: PlanTutorDto): void {
    this.plan = plan;
    this.idReserva = plan.idReserva;

    if (plan.estadoHoja === 'enviado_al_tutor') {
      this.marcarComoVisto();
    }
  }

  abrirPlanDesdeLista(plan: PlanTutorDto): void {
    this.router.navigate(['/tutor/plan', plan.idReserva]);
  }

  marcarComoVisto(): void {
    this.planApiService
      .marcarComoVisto(this.idReserva)
      .subscribe({
        next: plan => {
          this.plan = plan;
        },
        error: error => console.error(error)
      });
  }

  cambiarTab(tab: PlanTab): void {
    if (tab === 'ajuste' && this.esSoloLectura()) {
      return;
    }

    this.tabActiva = tab;
  }

  esSoloLectura(): boolean {
    if (!this.plan) {
      return true;
    }

    return (
      this.plan.estadoSesion === 'finalizado' ||
      this.plan.pagoRegistrado === true
    );
  }

  obtenerMensajeSoloLectura(): string {
    if (!this.plan) {
      return '';
    }

    if (this.plan.estadoSesion === 'finalizado' || this.plan.pagoRegistrado) {
      return 'Esta hoja de ruta pertenece a una sesión finalizada. Puedes revisarla, pero ya no es posible solicitar ajustes ni aprobar cambios.';
    }

    return '';
  }

  abrirModalAjuste(): void {
    if (this.esSoloLectura()) {
      return;
    }

    this.modalAjusteAbierto = true;
  }

  cerrarModalAjuste(): void {
    this.modalAjusteAbierto = false;
  }

  enviarSolicitudAjuste(): void {
    if (!this.plan || this.esSoloLectura()) {
      return;
    }

    if (this.formularioAjuste.invalid) {
      this.formularioAjuste.markAllAsTouched();
      return;
    }

    const request: AjusteHojaRutaRequest = {
      idEjercicioOriginal: Number(this.idEjercicioOriginalControl.value),
      motivoCambio: this.motivoCambioControl.value || '',
      motivoDetallado: this.motivoDetalladoControl.value || '',
      ejercicioModificado: this.ejercicioModificadoControl.value || ''
    };

    this.enviandoAjuste = true;

    this.planApiService
      .solicitarAjuste(
        this.plan.idReserva,
        this.plan.idRuta,
        request
      )
      .subscribe({
        next: plan => {
          this.plan = plan;
          this.enviandoAjuste = false;
          this.formularioAjuste.reset();
          this.modalAjusteAbierto = false;
        },
        error: error => {
          console.error(error);
          this.enviandoAjuste = false;
        }
      });
  }

  aceptarHojaRuta(): void {
    if (!this.plan || this.esSoloLectura()) {
      return;
    }

    this.aceptando = true;

    this.planApiService
      .aceptarHojaRuta(this.plan.idRuta)
      .subscribe({
        next: () => {
          this.aceptando = false;
          this.router.navigate(['/tutor/actividad']);
        },
        error: error => {
          console.error(error);
          this.aceptando = false;
        }
      });
  }

  volverReservas(): void {
    this.router.navigate(['/tutor/reserva']);
  }

  obtenerEstadoTexto(estado: string): string {
    const estados: Record<string, string> = {
      pendiente_envio: 'Pendiente de envío',
      enviado_al_tutor: 'Enviada al tutor',
      visto_tutor: 'Vista por tutor',
      observado_tutor: 'Observada por tutor',
      modificado_instructor: 'Modificada por instructor',
      aprobado_tutor: 'Aprobada por tutor'
    };

    return estados[estado] || estado;
  }

  obtenerMotivoTexto(motivo: string): string {
    const motivos: Record<string, string> = {
      sensibilidad_sensorial: 'Sensibilidad sensorial',
      fatiga_alta: 'Fatiga alta',
      complejidad_ejercicio: 'Complejidad del ejercicio',
      preferencia_paciente: 'Preferencia del paciente',
      otro: 'Otro motivo'
    };

    return motivos[motivo] || motivo;
  }

  obtenerEstadoAjuste(ajuste: {
    autorizadoPorInstructor: boolean | null;
  }): string {
    if (ajuste.autorizadoPorInstructor === true) {
      return 'aprobado';
    }

    return 'pendiente';
  }

  inicial(nombre: string | null | undefined): string {
    if (!nombre) {
      return '?';
    }

    return nombre.trim().charAt(0).toUpperCase();
  }

  formatearFecha(fecha: string | null | undefined): string {
    if (!fecha) {
      return 'Sin fecha';
    }

    return new Date(fecha).toLocaleString('es-PE', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackEjercicio(
    index: number,
    ejercicio: DetalleRutinaPlanDto
  ): number {
    return ejercicio.idDetalleRutina;
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