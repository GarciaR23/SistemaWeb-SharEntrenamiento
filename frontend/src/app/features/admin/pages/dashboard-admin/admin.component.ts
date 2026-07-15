import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConteoSolicitudes, SolicitudesService } from '../../services/solicitudes.service';
import { MonitoreoService } from '../../services/monitoreo.service';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { DashboardInstructores } from '../../models/admin-dashboard.model';
import { DashboardEstadoSolicitud } from '../../models/estado-solicitud.model';
import { PacienteControl } from '../../models/paciente-control.model';

@Component({
  selector: 'app-admin-inicio',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class Inicio implements OnInit {
  totalPendientes: number = 0;
  totalActivos: number = 0;
  fechaInicio: string = '';
  fechaFin: string = '';
  selectedCard: 'solicitudes' | 'instructores' | 'pacientes' = 'solicitudes';

  pacienteControl: PacienteControl | null = null;
  dashboardInstructores: DashboardInstructores | null = null;
  estadoSolicitudes: DashboardEstadoSolicitud | null = null;

  constructor(
    private solicitudesService: SolicitudesService,
    private monitoreoService: MonitoreoService,
    private adminDashboardService: AdminDashboardService
  ) { }

  ngOnInit(): void {
    this.cargarConteos();
    this.cargarControlPacientes();
    this.cargarDashboardInstructores();
    this.cargarEstadoSolicitudes();
  }

  cargarConteos(): void {
    this.solicitudesService.obtenerConteo().subscribe({
      next: (conteo: ConteoSolicitudes) => { this.totalPendientes = conteo.totalPendientes; },
      error: (err) => console.error('Error al cargar conteo:', err),
    });
    this.monitoreoService.obtenerConteoInstructor().subscribe({
      next: (conteo) => { this.totalActivos = conteo.activoInstructor; },
      error: (err) => console.error('Error al cargar activos:', err),
    });
  }

  cargarControlPacientes(): void {
    this.adminDashboardService.obtenerControlPacientes().subscribe({
      next: (data: PacienteControl) => { this.pacienteControl = data; },
      error: (err) => console.error('Error al cargar control de pacientes:', err),
    });
  }

  cargarDashboardInstructores(fechaInicio?: string, fechaFin?: string): void {
    this.adminDashboardService.obtenerDashboardInstructores(fechaInicio, fechaFin).subscribe({
      next: (data: DashboardInstructores) => { this.dashboardInstructores = data; },
      error: (err) => console.error('Error al cargar dashboard instructores:', err),
    });
  }

  cargarEstadoSolicitudes(): void {
    this.adminDashboardService.obtenerEstadoSolicitudes().subscribe({
      next: (data: DashboardEstadoSolicitud) => { this.estadoSolicitudes = data; },
      error: (err) => console.error('Error al cargar estado de solicitudes:', err),
    });
  }

  get porcentajePacientes(): string {
    if (!this.pacienteControl) return '+0%';
    const p = this.pacienteControl.porcentajeVariacion;
    return `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`;
  }

  get porcentajeInstructores(): string {
    if (!this.dashboardInstructores) return '+0%';
    const p = this.dashboardInstructores.porcentajeMensual;
    return `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`;
  }

  getLineChartPoints(): string {
    if (!this.dashboardInstructores || this.dashboardInstructores.crecimiento.length === 0) return '';
    const max = Math.max(...this.dashboardInstructores.crecimiento.map(c => c.totalNuevos), 1);
    return this.dashboardInstructores.crecimiento.map((item, i) => {
      const x = (i / (this.dashboardInstructores!.crecimiento.length - 1)) * 100;
      const y = 100 - (item.totalNuevos / max) * 80;
      return `${x},${y}`;
    }).join(' ');
  }

  getPorcentajeEstado(estado: string): number {
    if (!this.estadoSolicitudes) return 0;
    const encontrado = this.estadoSolicitudes.estados.find(e => e.estado === estado);
    return encontrado ? encontrado.porcentaje : 0;
  }

  get totalSolicitudes(): number {
    return this.estadoSolicitudes?.totalSolicitudes || 0;
  }

  obtenerMes(mes: string): string {
    const meses: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const num = parseInt(mes.substring(5, 7));
    return meses[num - 1] || mes;
  }

  selectCard(card: 'solicitudes' | 'instructores' | 'pacientes'): void {
    this.selectedCard = card;
  }

  filtrarPorRango(): void {
    if (this.fechaInicio && this.fechaFin) {
      this.cargarDashboardInstructores(this.fechaInicio, this.fechaFin);
    } else {
      this.cargarDashboardInstructores();
    }
  }
}