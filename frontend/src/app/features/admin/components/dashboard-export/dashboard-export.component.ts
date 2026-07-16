import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { DashboardInstructores } from '../../models/admin-dashboard.model';
import { DashboardEstadoSolicitud } from '../../models/estado-solicitud.model';

@Component({
  selector: 'app-dashboard-export',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-export.component.html',
  styleUrls: ['./dashboard-export.component.scss']
})
export class DashboardExportComponent {
  @Input() dashboardInstructores: DashboardInstructores | null = null;
  @Input() estadoSolicitudes: DashboardEstadoSolicitud | null = null;

  fechaInicio: string = '';
  fechaFin: string = '';
  exportando: boolean = false;
  horaExportacion: string = '';

  exportar(): void {
    if (!this.fechaInicio || !this.fechaFin) return;
    this.exportando = true;
    this.horaExportacion = new Date().toLocaleString('es-PE');

    const wb = XLSX.utils.book_new();

    if (this.dashboardInstructores?.crecimiento.length) {
      const data1 = this.dashboardInstructores.crecimiento.map(c => ({
        Mes: c.mes,
        'Total Nuevos': c.totalNuevos
      }));
      data1.push({ Mes: 'Porcentaje Mensual', 'Total Nuevos': this.dashboardInstructores.porcentajeMensual });
      const ws1 = XLSX.utils.json_to_sheet(data1);
      XLSX.utils.book_append_sheet(wb, ws1, 'Crecimiento Instructores');
    }

    if (this.estadoSolicitudes?.estados.length) {
      const data2 = this.estadoSolicitudes.estados.map(e => ({
        Estado: e.estado,
        'Porcentaje (%)': e.porcentaje
      }));
      data2.push({ Estado: 'Total Solicitudes', 'Porcentaje (%)': this.estadoSolicitudes.totalSolicitudes });
      const ws2 = XLSX.utils.json_to_sheet(data2);
      XLSX.utils.book_append_sheet(wb, ws2, 'Estado Solicitudes');
    }

    XLSX.writeFile(wb, `dashboard_${this.fechaInicio}_${this.fechaFin}.xlsx`);
    this.exportando = false;
  }

  get periodoLabel(): string {
    if (this.fechaInicio && this.fechaFin) {
      return `${this.formatearFecha(this.fechaInicio)} — ${this.formatearFecha(this.fechaFin)}`;
    }
    return 'Selecciona un rango de fechas';
  }

  private formatearFecha(fecha: string): string {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }
}