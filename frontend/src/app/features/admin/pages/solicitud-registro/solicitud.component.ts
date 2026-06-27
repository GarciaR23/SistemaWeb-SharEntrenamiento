import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '../../services/solicitudes.service';
import { CommonModule } from '@angular/common';
import { RevisionDocumento } from '../revision-documento/revision-documento.component';
import { SolicitudInstructor } from '../../models/solicitud.model';

@Component({
  standalone: true,
  selector: 'app-solicitud',
  imports: [CommonModule, RevisionDocumento],
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss'],
})
export class Solicitud implements OnInit {
  listaSolicitudes: SolicitudInstructor[] = [];
  totalPendientes: number = 0;
  pendientesHoy: number = 0;
  solicitudesPorVencer: number = 0;
  cargando: boolean = true;

  constructor(private solicitudesService: SolicitudesService) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.solicitudesService.obtenerTodo().subscribe({
      next: (result) => {
        this.listaSolicitudes = result.solicitudes || [];
        this.totalPendientes = result.conteo.totalPendientes;
        this.pendientesHoy = result.conteo.pendientesHoy;
        this.solicitudesPorVencer = result.conteo.pendientesPorVencer;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al recuperar solicitudes:', err);
        this.cargando = false;
      }
    });
  }

  removerCard(idInstructor: number): void {
    this.listaSolicitudes = this.listaSolicitudes.filter(
      solicitud => solicitud.idInstructor !== idInstructor
    );

    this.totalPendientes = this.listaSolicitudes.length;
  }

  obtenerClaseCard(solicitud: SolicitudInstructor): string {
    const horasRestantes = this.obtenerHorasRestantes(solicitud.fechaUltimoEnvio);

    if (horasRestantes < 0) {
      return 'card-rejected';
    }

    if (this.esRegistroDeHoy(solicitud.fechaUltimoEnvio)) {
      return 'card-today';
    }

    if (horasRestantes < 24) {
      return 'card-pending';
    }

    return 'card-approved';
  }

  obtenerClaseEstado(solicitud: SolicitudInstructor): string {
    const horasRestantes = this.obtenerHorasRestantes(solicitud.fechaUltimoEnvio);

    if (horasRestantes < 0) {
      return 'badge-status-rejected';
    }

    if (this.esRegistroDeHoy(solicitud.fechaUltimoEnvio)) {
      return 'badge-status-today';
    }

    if (horasRestantes < 24) {
      return 'badge-status-pending';
    }

    return 'badge-status-approved';
  }


  obtenerHorasRestantes(fechaUltimoEnvio: string): number {
    const fechaEnvio = new Date(fechaUltimoEnvio);

    if (isNaN(fechaEnvio.getTime())) {
      return 999;
    }

    const fechaLimite = new Date(fechaEnvio.getTime() + 72 * 60 * 60 * 1000);
    const ahora = new Date();

    const diferenciaMs = fechaLimite.getTime() - ahora.getTime();

    return Math.ceil(diferenciaMs / (1000 * 60 * 60));
  }

  obtenerTextoVencimiento(solicitud: SolicitudInstructor): string {
    const horasRestantes = this.obtenerHorasRestantes(solicitud.fechaUltimoEnvio);

    if (horasRestantes < 0) {
      return 'Solicitud vencida';
    }

    if (horasRestantes < 24) {
      return `Vence en ${horasRestantes} h`;
    }

    const diasRestantes = Math.ceil(horasRestantes / 24);
    return `Vence en ${diasRestantes} días`;
  }

  obtenerClaseVencimiento(solicitud: SolicitudInstructor): string {
    const horasRestantes = this.obtenerHorasRestantes(solicitud.fechaUltimoEnvio);

    if (horasRestantes < 0) {
      return 'expiration-expired';
    }

    if (this.esRegistroDeHoy(solicitud.fechaUltimoEnvio)) {
      return 'expiration-today';
    }

    if (horasRestantes < 24) {
      return 'expiration-warning';
    }

    return 'expiration-ok';
  }

  esRegistroDeHoy(fechaUltimoEnvio: string): boolean {
    const fechaEnvio = new Date(fechaUltimoEnvio);
    const hoy = new Date();

    return (
      fechaEnvio.getFullYear() === hoy.getFullYear() &&
      fechaEnvio.getMonth() === hoy.getMonth() &&
      fechaEnvio.getDate() === hoy.getDate()
    );
  }}