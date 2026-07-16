import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonitoreoService, ConteoPaciente } from '../../services/monitoreo.service';
import { PacienteMonitoreo } from '../../models/paciente-monitoreo.model';
import { ReporteConfig } from '../../models/reporte-config.model';
import { ReporteComponent } from "../../components/reporte/reporte.component";

@Component({
  selector: 'app-reporte-paciente',
  imports: [CommonModule, FormsModule, ReporteComponent],
  templateUrl: './reporte-paciente.component.html',
  styleUrls: ['./reporte-paciente.component.scss'],
})

export class ReportePaciente implements OnInit {
  pacientes: PacienteMonitoreo[] = [];
  pacientesOriginales: PacienteMonitoreo[] = [];
  pacientesPaginados: PacienteMonitoreo[] = [];
  conteo: ConteoPaciente = { totalPaciente: 0, activoPaciente: 0, inactivos60Dias: 0 };
  terminoBusqueda = '';

  filtroServicios: 'all' | 'top' = 'all';
  filtroEstadoCuenta: 'todos' | 'activo' | 'suspendido' | 'pendiente_validacion' = 'todos';
  filtroOrdenNombre: 'asc' | 'desc' = 'asc';
  mostrarFiltroAvanzado = false;
  accordionStates: Record<'mostrar' | 'ordenar' | 'estado', boolean> = {
    mostrar: true,
    ordenar: false,
    estado: false,
  };

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
        this.pacientesOriginales = data;
        this.pacientes = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al cargar pacientes:', err),
    });
  }

  aplicarFiltros(): void {
    let resultados = [...this.pacientesOriginales];
    const textoBusqueda = this.terminoBusqueda.trim().toLowerCase();

    if (textoBusqueda) {
      resultados = resultados.filter(p => (p.nombrePaciente || '').toLowerCase().includes(textoBusqueda));
    }

    if (this.filtroEstadoCuenta !== 'todos') {
      resultados = resultados.filter(p => p.estadoCuenta === this.filtroEstadoCuenta);
    }

    if (this.filtroServicios === 'top') {
      resultados = resultados.sort((a, b) => (b.historialSesiones || 0) - (a.historialSesiones || 0));
    }

    resultados = resultados.sort((a, b) => {
      const nombreA = (a.nombrePaciente || '').toLowerCase();
      const nombreB = (b.nombrePaciente || '').toLowerCase();
      return this.filtroOrdenNombre === 'asc' ? nombreA.localeCompare(nombreB) : nombreB.localeCompare(nombreA);
    });

    this.pacientes = resultados;
    this.totalPaginas = Math.ceil(this.pacientes.length / this.pageSize);
    this.irPagina(1);
  }

  toggleFiltroAvanzado(): void {
    this.mostrarFiltroAvanzado = !this.mostrarFiltroAvanzado;
  }

  toggleAccordion(section: 'mostrar' | 'ordenar' | 'estado'): void {
    this.accordionStates[section] = !this.accordionStates[section];
  }

  aplicarFiltroAvanzado(): void {
    this.mostrarFiltroAvanzado = false;
    this.aplicarFiltros();
  }

  buscar(nombre: string): void {
    this.terminoBusqueda = nombre;
    this.aplicarFiltros();
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

  limpiarFiltros(): void {
    this.filtroServicios = 'all';
    this.filtroEstadoCuenta = 'todos';
    this.filtroOrdenNombre = 'asc';
    this.terminoBusqueda = '';
    this.accordionStates = { mostrar: true, ordenar: false, estado: false };
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

  getCondicionLabel(estado: string): string {
    switch (estado) {
      case 'activo': return 'Activo';
      case 'suspendido': return 'Bloqueado';
      case 'pendiente_validacion': return 'Pendiente';
      default: return estado || 'N/A';
    }
  }

  get reporteConfig(): ReporteConfig {
    return {
      titulo: 'Reporte de Pacientes',
      tipo: 'pacientes',
      columnas: [
        { key: 'nombrePaciente', label: 'Paciente' },
        { key: 'nombreTutor', label: 'Tutor' },
        { key: 'estadoCuenta', label: 'Estado', tipo: 'estado' },
        { key: 'historialSesiones', label: 'Historial' },
        { key: 'condicion', label: 'Condición' },
        { key: 'instructores', label: 'Instructores' },
        { key: 'ultimoLogin', label: 'Última Interacción' }
      ],
      datos: this.pacientes.map(p => ({
        ...p,
        condicion: p.condicion || this.getCondicionLabel(p.estadoCuenta),
        instructores: this.getInstructoresAvatares(p.imagenesInstructores).length + ' instructores',
        ultimoLogin: this.getUltimoLogin(p.ultimoLogin)
      })),
      filtrosAplicados: this.getFiltrosActivos(),
      resumen: [
        { label: 'Total Pacientes', valor: String(this.conteo.totalPaciente) },
        { label: 'Activos', valor: String(this.conteo.activoPaciente) },
        { label: 'Inactivos', valor: String(this.conteo.inactivos60Dias) }
      ]
    };
  }

  getFiltrosActivos(): { label: string; valor: string }[] {
    const filtros: { label: string; valor: string }[] = [];
    if (this.terminoBusqueda) filtros.push({ label: 'Búsqueda', valor: this.terminoBusqueda });
    if (this.filtroEstadoCuenta !== 'todos') filtros.push({ label: 'Estado', valor: this.filtroEstadoCuenta });
    if (this.filtroServicios === 'top') filtros.push({ label: 'Orden', valor: 'Más servicios' });
    return filtros;
  }
}