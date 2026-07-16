import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';
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

  mensajeAlerta: string = '';
  mostrarAlerta: boolean = false;

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
    return mes.substring(5, 7);
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

  exportarDashboard(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      this.mensajeAlerta = 'Debes seleccionar ambas fechas antes de exportar.';
      this.mostrarAlerta = true;
      setTimeout(() => { this.mostrarAlerta = false; }, 4000);
      return;
    }

    const wb = XLSX.utils.book_new();

    if (this.dashboardInstructores?.crecimiento.length) {
      const data1 = this.dashboardInstructores.crecimiento.map(c => ({
        Mes: c.mes,
        'Total Nuevos': c.totalNuevos
      }));
      data1.push({ Mes: 'Porcentaje Mensual', 'Total Nuevos': this.dashboardInstructores.porcentajeMensual });
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data1), 'Crecimiento Instructores');
    }

    if (this.estadoSolicitudes?.estados.length) {
      const data2 = this.estadoSolicitudes.estados.map(e => ({
        Estado: e.estado,
        'Porcentaje (%)': e.porcentaje
      }));
      data2.push({ Estado: 'Total Solicitudes', 'Porcentaje (%)': this.estadoSolicitudes.totalSolicitudes });
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data2), 'Estado Solicitudes');
    }

    XLSX.writeFile(wb, `dashboard_${this.fechaInicio}_${this.fechaFin}.xlsx`);
  }
}