
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonitoreoService, ConteoPaciente } from '../../services/monitoreo.service';
import { PacienteMonitoreo } from '../../models/paciente-monitoreo.model';

@Component({
  selector: 'app-reporte-paciente',
  imports: [CommonModule, FormsModule],
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

  exportarPDF(): void {
    const datosExportar = (this.pacientesPaginados.length ? this.pacientesPaginados : this.pacientes).map(p => ({
      nombre: p.nombrePaciente,
      tutor: p.nombreTutor,
      estado: this.getEstadoLabel(p.estadoCuenta),
      historial: p.historialSesiones,
      condicion: this.getCondicionLabel(p.estadoCuenta),
      ultimaInteraccion: p.ultimoLogin,
    }));
    const url = this.generarPDFUrl(datosExportar, 'Reporte de Pacientes');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reporte-pacientes.pdf';
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
    this.accordionStates = {
      mostrar: true,
      ordenar: false,
      estado: false,
    };
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
      default: return 'N/A';
    }
  }
}
