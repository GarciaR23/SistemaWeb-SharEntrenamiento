
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InstructorMonitoreo } from '../../models/instructor-monitoreo.model';
import { ConteoInstructor, MonitoreoService } from '../../services/monitoreo.service';
import { FiltroInstructorService } from '../../services/filtro-instructor.service';

@Component({
  selector: 'app-reporte-instructor',
  imports: [CommonModule, FormsModule],
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

  exportarPDF(): void {
    const datosExportar = (this.instructoresPaginados.length ? this.instructoresPaginados : this.instructores).map(ins => ({
      nombre: ins.nombreCompleto,
      especialidad: ins.especialidad,
      estado: this.getEstadoLabel(ins.estadoCuenta),
      puntaje: ins.puntaje,
      servicios: ins.numeroSesion,
    }));
    const url = this.generarPDFUrl(datosExportar, 'Reporte de Instructores');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reporte-instructores.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  private generarPDFUrl(datos: Array<Record<string, unknown>>, titulo: string): string {
    const lineas = [`Reporte: ${titulo}`, ''];
    datos.forEach((dato, index) => {
      lineas.push(`${index + 1}. ${JSON.stringify(dato)}`);
    });

    const texto = lineas.join('\n');
    const lineasPdf = texto.split('\n').map(linea => {
      return linea
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)');
    });

    const contenidoStream = lineasPdf
      .map((linea, index) => `BT /F1 10 Tf 50 ${780 - index * 14} Td (${linea}) Tj ET`)
      .join('\n');

    const objects: string[] = [];
    objects.push('<< /Type /Catalog /Pages 2 0 R >>');
    objects.push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>');
    objects.push(`<< /Length ${contenidoStream.length} >>\nstream\n${contenidoStream}\nendstream`);
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

    let pdf = '%PDF-1.4\n';
    const offsets: number[] = [];

    objects.forEach((obj, index) => {
      offsets.push(pdf.length);
      pdf += `${index + 1} 0 obj\n${obj}\nendobj\n`;
    });

    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    offsets.forEach(offset => {
      pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
    });

    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
    pdf += `startxref\n${xrefOffset}\n%%EOF`;

    const blob = new Blob([pdf], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
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
    this.accordionStates = {
      prioridad: true,
      ordenar: false,
      especialidad: false,
    };
  }
}

