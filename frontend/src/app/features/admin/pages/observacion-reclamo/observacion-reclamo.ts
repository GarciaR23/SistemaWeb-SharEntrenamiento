import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observacion, ContadorObservaciones } from '../../models/observacion.model';
import { ObservacionService } from '../../services/observacion.service';
import { ReporteComponent } from '../../components/reporte/reporte.component';
import { ReporteConfig } from '../../models/reporte-config.model';

@Component({
  selector: 'app-observacion-reclamo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReporteComponent],
  templateUrl: './observacion-reclamo.html',
  styleUrl: './observacion-reclamo.scss',
})
export class ObservacionReclamo implements OnInit {
  conteo: ContadorObservaciones = { totalCasos: 0, enMediacion: 0, rechazados: 0 };
  observaciones: Observacion[] = [];
  observacionesFiltradas: Observacion[] = [];
  observacionesPaginadas: Observacion[] = [];

  terminoBusqueda = '';
  filtroTipo: 'todos' | 'impuntualidad' | 'mal_trato' | 'incidente_menor' | 'colapso_paciente' = 'todos';
  filtroGravedad: 'todas' | 'critica' | 'moderada' | 'baja' = 'todas';
  filtroAccion: 'todas' | 'pendiente' | 'mediacion' | 'rechazado' | 'suspender' = 'todas';
  mostrarFiltroAvanzado = false;
  accordionStates: Record<'tipo' | 'gravedad' | 'accion', boolean> = {
    tipo: true,
    gravedad: false,
    accion: false,
  };

  paginaActual = 1;
  totalPaginas = 1;
  readonly pageSize = 10;

  dropdownAbierto: number | null = null;
  modalEvidenciaAbierto = false;
  evidenciaSeleccionada: Observacion | null = null;

  modalConfirmacionAbierto = false;
  accionPendiente: { id: number; accion: string } | null = null;

  mensajeExito: string = '';
  mostrarMensajeExito: boolean = false;

  constructor(private observacionService: ObservacionService) { }

  ngOnInit(): void {
    this.cargarContadores();
    this.cargarObservaciones();
  }

  cargarContadores(): void {
    this.observacionService.obtenerContadores().subscribe({
      next: (data) => (this.conteo = data),
      error: (err) => console.error('Error al cargar contadores:', err),
    });
  }

  cargarObservaciones(): void {
    this.observacionService.obtenerObservaciones().subscribe({
      next: (data) => {
        this.observaciones = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al cargar observaciones:', err),
    });
  }

  getTipoLabel(tipo: string): string {
    switch (tipo) {
      case 'impuntualidad': return 'Impuntualidad';
      case 'mal_trato': return 'Mal trato';
      case 'incidente_menor': return 'Incidente menor';
      case 'colapso_paciente': return 'Colapso paciente';
      default: return tipo;
    }
  }

  getAccionLabel(accion: string): string {
    switch (accion) {
      case 'pendiente': return 'Pendiente';
      case 'rechazado': return 'Rechazado';
      case 'mediacion': return 'En mediación';
      case 'suspender': return 'Suspendido';
      default: return accion;
    }
  }

  getGravedadColor(gravedad: string): string {
    switch (gravedad?.toLowerCase()) {
      case 'critica': case 'crítica': return 'indicator-critica';
      case 'moderada': return 'indicator-moderada';
      case 'baja': return 'indicator-baja';
      default: return '';
    }
  }

  toggleFiltroAvanzado(): void { this.mostrarFiltroAvanzado = !this.mostrarFiltroAvanzado; }

  toggleAccordion(section: 'tipo' | 'gravedad' | 'accion'): void {
    this.accordionStates[section] = !this.accordionStates[section];
  }

  aplicarFiltroAvanzado(): void { this.mostrarFiltroAvanzado = false; this.aplicarFiltros(); }

  buscar(texto: string): void { this.terminoBusqueda = texto; this.aplicarFiltros(); }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.filtroTipo = 'todos';
    this.filtroGravedad = 'todas';
    this.filtroAccion = 'todas';
    this.accordionStates = { tipo: true, gravedad: false, accion: false };
    this.aplicarFiltros();
    this.mostrarFiltroAvanzado = false;
  }

  aplicarFiltros(): void {
    let resultados = [...this.observaciones];
    const texto = this.terminoBusqueda.trim().toLowerCase();

    if (texto) {
      resultados = resultados.filter(o =>
        o.nombrePaciente?.toLowerCase().includes(texto) ||
        o.nombreInstructor?.toLowerCase().includes(texto) ||
        o.detalleReclamo?.toLowerCase().includes(texto)
      );
    }

    if (this.filtroTipo !== 'todos') {
      resultados = resultados.filter(o => o.tipoReclamo === this.filtroTipo);
    }

    if (this.filtroGravedad !== 'todas') {
      const g = this.filtroGravedad.charAt(0).toUpperCase() + this.filtroGravedad.slice(1);
      resultados = resultados.filter(o => o.nivelGravedad?.toLowerCase() === g.toLowerCase());
    }

    if (this.filtroAccion !== 'todas') {
      resultados = resultados.filter(o => o.accionSugerida === this.filtroAccion);
    }

    this.observacionesFiltradas = resultados;
    this.totalPaginas = Math.max(1, Math.ceil(resultados.length / this.pageSize));
    this.irPagina(1);
  }

  irPagina(pagina: number): void {
    this.paginaActual = pagina;
    const inicio = (pagina - 1) * this.pageSize;
    this.observacionesPaginadas = this.observacionesFiltradas.slice(inicio, inicio + this.pageSize);
  }

  verEvidencia(obs: Observacion): void {
    this.evidenciaSeleccionada = obs;
    this.modalEvidenciaAbierto = true;
  }

  cerrarModalEvidencia(): void {
    this.modalEvidenciaAbierto = false;
    this.evidenciaSeleccionada = null;
  }

  imagenesEvidencia(): string[] {
    if (!this.evidenciaSeleccionada) return [];
    const e = this.evidenciaSeleccionada;
    const imgs: string[] = [];
    if (e.urlEvidencia1) imgs.push(e.urlEvidencia1);
    if (e.urlEvidencia2) imgs.push(e.urlEvidencia2);
    if (e.urlEvidencia3) imgs.push(e.urlEvidencia3);
    return imgs;
  }

  toggleDropdown(id: number): void {
    this.dropdownAbierto = this.dropdownAbierto === id ? null : id;
  }

  confirmarAccion(idIncidencia: number, accion: string): void {
    this.accionPendiente = { id: idIncidencia, accion };
    this.modalConfirmacionAbierto = true;
    this.dropdownAbierto = null;
  }

  ejecutarAccionConfirmada(): void {
    if (!this.accionPendiente) return;
    const { id, accion } = this.accionPendiente;
    this.observacionService.actualizarAccion(id, accion).subscribe({
      next: () => {
        this.modalConfirmacionAbierto = false;
        this.accionPendiente = null;
        this.mensajeExito = `Caso #${id} actualizado a "${this.getAccionLabel(accion)}" exitosamente.`;
        this.mostrarMensajeExito = true;
        setTimeout(() => { this.mostrarMensajeExito = false; }, 4000);
        this.cargarObservaciones();
        this.cargarContadores();
      },
      error: (err) => console.error('Error al actualizar acción:', err),
    });
  }

  cerrarModalConfirmacion(): void {
    this.modalConfirmacionAbierto = false;
    this.accionPendiente = null;
  }

  get reporteConfig(): ReporteConfig {
    return {
      titulo: 'Reporte de Incidencias',
      tipo: 'instructores',
      columnas: [
        { key: 'tipoReclamo', label: 'Tipo' },
        { key: 'nivelGravedad', label: 'Gravedad' },
        { key: 'nombrePaciente', label: 'Paciente' },
        { key: 'nombreInstructor', label: 'Instructor' },
        { key: 'detalleReclamo', label: 'Detalle' },
        { key: 'accionSugerida', label: 'Acción', tipo: 'estado' }
      ],
      datos: this.observacionesFiltradas.map(o => ({ ...o, tipoReclamo: this.getTipoLabel(o.tipoReclamo) })),
      filtrosAplicados: this.getFiltrosActivos(),
      resumen: [
        { label: 'Total Casos', valor: String(this.conteo.totalCasos) },
        { label: 'En Mediación', valor: String(this.conteo.enMediacion) },
        { label: 'Rechazados', valor: String(this.conteo.rechazados) }
      ]
    };
  }

  getFiltrosActivos(): { label: string; valor: string }[] {
    const filtros: { label: string; valor: string }[] = [];
    if (this.terminoBusqueda) filtros.push({ label: 'Búsqueda', valor: this.terminoBusqueda });
    if (this.filtroTipo !== 'todos') filtros.push({ label: 'Tipo', valor: this.getTipoLabel(this.filtroTipo) });
    if (this.filtroGravedad !== 'todas') filtros.push({ label: 'Gravedad', valor: this.filtroGravedad });
    if (this.filtroAccion !== 'todas') filtros.push({ label: 'Acción', valor: this.getAccionLabel(this.filtroAccion) });
    return filtros;
  }
}