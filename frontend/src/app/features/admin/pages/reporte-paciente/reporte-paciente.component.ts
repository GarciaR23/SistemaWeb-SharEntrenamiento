
import { Component, OnInit } from '@angular/core';
import { MonitoreoService, ConteoPaciente } from '../../services/monitoreo.service';
import { PacienteMonitoreo } from '../../models/paciente-monitoreo.model';

@Component({
  selector: 'app-reporte-paciente',
  imports: [],
  templateUrl: './reporte-paciente.component.html',
  styleUrls: ['./reporte-paciente.component.scss'],
})

export class ReportePaciente implements OnInit {
  pacientes: PacienteMonitoreo[] = [];
  pacientesPaginados: PacienteMonitoreo[] = [];
  conteo: ConteoPaciente = { totalPaciente: 0, activoPaciente: 0, inactivos60Dias: 0 };

  pageSize = 5;
  paginaActual = 1;
  totalPaginas = 0;

  constructor(private monitoreoService: MonitoreoService) { }

  ngOnInit(): void {
    this.cargarPacientes();
    this.cargarConteo();
  }

  cargarPacientes(): void {
    this.monitoreoService.obtenerPacientes().subscribe({
      next: (data) => {
        this.pacientes = data;
        this.totalPaginas = Math.ceil(this.pacientes.length / this.pageSize);
        this.irPagina(1);
      },
      error: (err) => console.error('Error al cargar pacientes:', err),
    });
  }

  cargarConteo(): void {
    this.monitoreoService.obtenerConteoPaciente().subscribe({
      next: (data) => (this.conteo = data),
      error: (err) => console.error('Error al cargar conteo:', err),
    });
  }

  irPagina(pagina: number): void {
    this.paginaActual = pagina;
    const inicio = (pagina - 1) * this.pageSize;
    this.pacientesPaginados = this.pacientes.slice(inicio, inicio + this.pageSize);
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'activo': return 'status-activo';
      case 'suspendido': return 'status-bloqueado';
      case 'pendiente_validacion': return 'status-pendiente';
      default: return '';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'activo': return 'ACTIVO';
      case 'suspendido': return 'BLOQUEADO';
      case 'pendiente_validacion': return 'PENDIENTE';
      default: return estado;
    }
  }

  getInstructoresAvatares(imagenes: string): string[] {
    return imagenes ? imagenes.split(',') : [];
  }

  getInstructorRestantes(imagenes: string): number {
    const arr = this.getInstructoresAvatares(imagenes);
    return arr.length > 2 ? arr.length - 2 : 0;
  }

  getUltimoLogin(login: string): string {
    if (!login) return 'Nunca';
    const fecha = new Date(login);
    return `${fecha.getDate()} ${fecha.toLocaleString('es', { month: 'short' })}, ${fecha.getFullYear()}`;
  }
}
