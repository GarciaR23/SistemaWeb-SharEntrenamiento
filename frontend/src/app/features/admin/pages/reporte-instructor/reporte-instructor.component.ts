import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InstructorMonitoreo } from '../../models/instructor-monitoreo.model';
import { ConteoInstructor, MonitoreoService } from '../../services/monitoreo.service';
import { FiltroInstructorService } from '../../services/filtro-instructor.service';
import { ReporteConfig } from '../../models/reporte-config.model';
import { ReporteComponent } from "../../components/reporte/reporte.component";

@Component({
  selector: 'app-reporte-instructor',
  imports: [CommonModule, FormsModule, ReporteComponent],
  templateUrl: './reporte-instructor.component.html',
  styleUrls: ['./reporte-instructor.component.scss'],
})
export class ReporteInstructor implements OnInit {
  instructores: InstructorMonitoreo[] = [];
  instructoresOriginales: InstructorMonitoreo[] = [];
  instructoresPaginados: InstructorMonitoreo[] = [];
  conteo: ConteoInstructor = { totalInstructor: 0, activoInstructor: 0, pendienteInstructor: 0 };
  terminoBusqueda = '';
  especialidadesDisponibles: string[] = [];

  filtroMayorPuntaje = false;
  filtroServicios = false;
  filtroOrdenNombre: 'asc' | 'desc' = 'asc';
  filtroEspecialidad = '';
  mostrarFiltroAvanzado = false;
  accordionStates: Record<'prioridad' | 'ordenar' | 'especialidad', boolean> = {
    prioridad: true,
    ordenar: false,
    especialidad: false,
  };

  pageSize = 5;
  paginaActual = 1;
  totalPaginas = 0;

  constructor(
    private monitoreoService: MonitoreoService,
    private filtroService: FiltroInstructorService
  ) { }

  ngOnInit(): void {
    this.cargarInstructores();
    this.cargarConteo();
  }

  cargarInstructores(): void {
    this.monitoreoService.obtenerInstructores().subscribe({
      next: (data) => {
        this.instructoresOriginales = data;
        this.especialidadesDisponibles = Array.from(new Set(data.map(i => i.especialidad).filter(Boolean)));
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al cargar instructores:', err),
    });
  }

  aplicarFiltros(): void {
    let resultados = [...this.instructoresOriginales];
    const textoBusqueda = this.terminoBusqueda.trim().toLowerCase();

    if (textoBusqueda) {
      resultados = resultados.filter(i => (i.nombreCompleto || '').toLowerCase().includes(textoBusqueda));
    }

    if (this.filtroEspecialidad) {
      resultados = resultados.filter(i => i.especialidad === this.filtroEspecialidad);
    }

    if (this.filtroMayorPuntaje) {
      resultados = resultados.sort((a, b) => (b.puntaje || 0) - (a.puntaje || 0));
    }

    if (this.filtroServicios) {
      resultados = resultados.sort((a, b) => (b.numeroSesion || 0) - (a.numeroSesion || 0));
    }

    resultados = resultados.sort((a, b) => {
      const nombreA = (a.nombreCompleto || '').toLowerCase();
      const nombreB = (b.nombreCompleto || '').toLowerCase();
      return this.filtroOrdenNombre === 'asc' ? nombreA.localeCompare(nombreB) : nombreB.localeCompare(nombreA);
    });

    this.instructores = resultados;
    this.totalPaginas = Math.ceil(this.instructores.length / this.pageSize);
    this.irPagina(1);
  }

  toggleFiltroAvanzado(): void {
    this.mostrarFiltroAvanzado = !this.mostrarFiltroAvanzado;
  }

  toggleAccordion(section: 'prioridad' | 'ordenar' | 'especialidad'): void {
    this.accordionStates[section] = !this.accordionStates[section];
  }

  aplicarFiltroAvanzado(): void {
    this.mostrarFiltroAvanzado = false;
    this.aplicarFiltros();
  }

  cargarConteo(): void {
    this.monitoreoService.obtenerConteoInstructor().subscribe({
      next: (data) => (this.conteo = data),
      error: (err) => console.error('Error al cargar conteo:', err),
    });
  }

  buscar(nombre: string): void {
    this.terminoBusqueda = nombre;
    this.aplicarFiltros();
  }

  irPagina(pagina: number): void {
    this.paginaActual = pagina;
    const inicio = (pagina - 1) * this.pageSize;
    this.instructoresPaginados = this.instructores.slice(inicio, inicio + this.pageSize);
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'activo': return 'status-activo';
      case 'suspendido': return 'status-suspendido';
      case 'pendiente_validacion': return 'status-pendiente';
      default: return '';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'activo': return 'ACTIVO';
      case 'pendiente_validacion': return 'PENDIENTE';
      case 'pendiente_subsanacion': return 'OBSERVADO';
      case 'suspendido': return 'SUSPENDIDO';
      default: return estado;
    }
  }

  getEstrellas(puntaje: number): string {
    if (!puntaje) return '☆☆☆☆☆';
    const llenas = Math.round(puntaje);
    return '★'.repeat(llenas) + '☆'.repeat(5 - llenas);
  }

  limpiarFiltros(): void {
    this.filtroMayorPuntaje = false;
    this.filtroServicios = false;
    this.filtroOrdenNombre = 'asc';
    this.filtroEspecialidad = '';
    this.terminoBusqueda = '';
    this.accordionStates = { prioridad: true, ordenar: false, especialidad: false };
  }

  get reporteConfig(): ReporteConfig {
    return {
      titulo: 'Reporte de Instructores',
      tipo: 'instructores',
      columnas: [
        { key: 'nombreCompleto', label: 'Instructor' },
        { key: 'especialidad', label: 'Especialidad' },
        { key: 'estadoCuenta', label: 'Estado', tipo: 'estado' },
        { key: 'puntaje', label: 'Puntaje', tipo: 'puntaje' },
        { key: 'numeroSesion', label: 'Servicios' }
      ],
      datos: this.instructores,
      filtrosAplicados: this.getFiltrosActivos(),
      resumen: [
        { label: 'Total Instructores', valor: String(this.conteo.totalInstructor) },
        { label: 'Activos', valor: String(this.conteo.activoInstructor) },
        { label: 'Pendientes', valor: String(this.conteo.pendienteInstructor) }
      ]
    };
  }

  getFiltrosActivos(): { label: string; valor: string }[] {
    const filtros: { label: string; valor: string }[] = [];
    if (this.terminoBusqueda) filtros.push({ label: 'Búsqueda', valor: this.terminoBusqueda });
    if (this.filtroEspecialidad) filtros.push({ label: 'Especialidad', valor: this.filtroEspecialidad });
    if (this.filtroMayorPuntaje) filtros.push({ label: 'Orden', valor: 'Mayor puntaje' });
    if (this.filtroServicios) filtros.push({ label: 'Orden', valor: 'Más servicios' });
    return filtros;
  }
}