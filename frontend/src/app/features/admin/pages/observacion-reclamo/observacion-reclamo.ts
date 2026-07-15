import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface UsuarioImplicado {
  nombre: string;
  rolSecundario: string;
  avatarUrl: string;
}

export interface Evidencia {
  tipo: 'documento' | 'video' | 'ninguna';
  url?: string;
}

export interface Incidencia {
  idIncidencia: string;
  tipoReclamo: 'RECLAMO DE PACIENTE' | 'RECLAMO DE INSTRUCTOR';
  gravedad: 'Crítica' | 'Moderada' | 'Baja';
  reportador: UsuarioImplicado;
  acusado: UsuarioImplicado;
  detalle: string;
  evidencia: Evidencia;
}

export interface ConteoIncidencias {
  casos: number;
  enMediacion: number;
  rechazados: number;
}

@Component({
  selector: 'app-observacion-reclamo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './observacion-reclamo.html',
  styleUrl: './observacion-reclamo.scss',
})
export class ObservacionReclamo implements OnInit {
  conteo: ConteoIncidencias = {
    casos: 24,
    enMediacion: 18,
    rechazados: 14,
  };

  incidencias: Incidencia[] = [];
  incidenciasFiltradas: Incidencia[] = [];
  incidenciasPaginadas: Incidencia[] = [];

  terminoBusqueda = '';
  filtroTipo: 'todos' | 'paciente' | 'instructor' = 'todos';
  filtroGravedad: 'todas' | 'critica' | 'moderada' | 'baja' = 'todas';
  filtroTipoReporte: 'todos' | 'documento' | 'video' | 'ninguna' = 'todos';
  mostrarFiltroAvanzado = false;
  accordionStates: Record<'tipo' | 'gravedad' | 'reporte', boolean> = {
    tipo: true,
    gravedad: false,
    reporte: false,
  };

  paginaActual = 1;
  totalPaginas = 1;
  readonly pageSize = 10;

  constructor() {}

  ngOnInit(): void {
    this.cargarDatosMuestra();
    this.aplicarFiltros();
  }

  getGravedadColor(gravedad: string): string {
    switch (gravedad) {
      case 'Crítica':
        return 'indicator-critica';
      case 'Moderada':
        return 'indicator-moderada';
      case 'Baja':
        return 'indicator-baja';
      default:
        return '';
    }
  }

  toggleFiltroAvanzado(): void {
    this.mostrarFiltroAvanzado = !this.mostrarFiltroAvanzado;
  }

  toggleAccordion(section: 'tipo' | 'gravedad' | 'reporte'): void {
    this.accordionStates[section] = !this.accordionStates[section];
  }

  aplicarFiltroAvanzado(): void {
    this.mostrarFiltroAvanzado = false;
    this.aplicarFiltros();
  }

  buscar(texto: string): void {
    this.terminoBusqueda = texto;
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.filtroTipo = 'todos';
    this.filtroGravedad = 'todas';
    this.filtroTipoReporte = 'todos';
    this.accordionStates = { tipo: true, gravedad: false, reporte: false };
    this.aplicarFiltros();
    this.mostrarFiltroAvanzado = false;
  }

  aplicarFiltros(): void {
    const textoBusqueda = this.terminoBusqueda.trim().toLowerCase();

    let resultados = [...this.incidencias];

    if (textoBusqueda) {
      resultados = resultados.filter((incidencia) => {
        const texto = `${incidencia.reportador.nombre} ${incidencia.detalle} ${incidencia.reportador.rolSecundario}`.toLowerCase();
        return texto.includes(textoBusqueda);
      });
    }

    if (this.filtroTipo !== 'todos') {
      const tipo = this.filtroTipo === 'paciente' ? 'RECLAMO DE PACIENTE' : 'RECLAMO DE INSTRUCTOR';
      resultados = resultados.filter((incidencia) => incidencia.tipoReclamo === tipo);
    }

    if (this.filtroGravedad !== 'todas') {
      const gravedad = this.filtroGravedad.charAt(0).toUpperCase() + this.filtroGravedad.slice(1);
      resultados = resultados.filter((incidencia) => incidencia.gravedad.toLowerCase() === gravedad.toLowerCase());
    }

    if (this.filtroTipoReporte !== 'todos') {
      resultados = resultados.filter((incidencia) => incidencia.evidencia.tipo === this.filtroTipoReporte);
    }

    this.incidenciasFiltradas = resultados;
    this.totalPaginas = Math.max(1, Math.ceil(resultados.length / this.pageSize));
    this.irPagina(1);
  }

  irPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) {
      return;
    }

    this.paginaActual = pagina;
    const inicio = (pagina - 1) * this.pageSize;
    this.incidenciasPaginadas = this.incidenciasFiltradas.slice(inicio, inicio + this.pageSize);
  }

  exportarPDF(): void {
    const datosExportar = this.incidenciasFiltradas.length ? this.incidenciasFiltradas : this.incidencias;
    const url = this.generarPDFUrl(datosExportar, 'Reporte de incidencias');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reporte-incidencias.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  private generarPDFUrl(datos: Array<Incidencia | Record<string, unknown>>, titulo: string): string {
    const lineas = [`Reporte: ${titulo}`, ''];
    datos.forEach((dato, index) => {
      const entrada = dato as Record<string, unknown>;
      const texto = Object.entries(entrada)
        .map(([clave, valor]) => `${clave}: ${valor}`)
        .join(' | ');
      lineas.push(`${index + 1}. ${texto}`);
    });

    const texto = lineas.join('\n');
    const lineasPdf = texto.split('\n').map((linea) => linea.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)'));

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
    offsets.forEach((offset) => {
      pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
    });

    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
    pdf += `startxref\n${xrefOffset}\n%%EOF`;

    const blob = new Blob([pdf], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  }

  private cargarDatosMuestra(): void {
    this.incidencias = [
      {
        idIncidencia: 'INC-001',
        tipoReclamo: 'RECLAMO DE PACIENTE',
        gravedad: 'Crítica',
        reportador: { nombre: 'L. M. (Reportó)', rolSecundario: 'vs. Instructor G. Ortega', avatarUrl: 'assets/avatar1.png' },
        acusado: { nombre: 'Instructor G. Ortega', rolSecundario: '', avatarUrl: 'assets/avatar2.png' },
        detalle: 'El instructor canceló la sesión 5 minutos antes sin previo aviso y se produjo una afectación.',
        evidencia: { tipo: 'documento', url: '#' },
      },
      {
        idIncidencia: 'INC-002',
        tipoReclamo: 'RECLAMO DE INSTRUCTOR',
        gravedad: 'Moderada',
        reportador: { nombre: 'Inst. Carlos A. (Reportó)', rolSecundario: 'vs. Paciente Mateo J.', avatarUrl: 'assets/avatar3.png' },
        acusado: { nombre: 'Paciente Mateo J.', rolSecundario: '', avatarUrl: 'assets/avatar4.png' },
        detalle: 'Conducta inapropiada recurrente durante las sesiones virtuales. El comportamiento afectó la confianza.',
        evidencia: { tipo: 'video', url: '#' },
      },
      {
        idIncidencia: 'INC-003',
        tipoReclamo: 'RECLAMO DE PACIENTE',
        gravedad: 'Baja',
        reportador: { nombre: 'Elena S. (Reportó)', rolSecundario: 'vs. Inst. Maria Elena', avatarUrl: 'assets/avatar5.png' },
        acusado: { nombre: 'Inst. Maria Elena', rolSecundario: '', avatarUrl: 'assets/avatar6.png' },
        detalle: 'La calidad del audio durante la última sesión fue muy deficiente e impidió la continuidad.',
        evidencia: { tipo: 'ninguna' },
      },
    ];
  }
}