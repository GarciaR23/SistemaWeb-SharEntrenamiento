import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Instructor {
  idInstructor: string;
  nombreCompleto: string;
  urlImagen: string;
  especialidad: string;
  estadoCuenta: 'ACTIVO' | 'SUSPENDIDO' | 'PENDIENTE';
  puntaje: number | null;
  numeroSesion: number;
}

export interface Conteo {
  totalInstructor: number;
  activoInstructor: number;
  pendienteInstructor: number;
}

@Component({
  selector: 'app-observacion-reclamo',
  standalone: true,
  imports: [CommonModule, FormsModule, UpperCasePipe],
  templateUrl: './observacion-reclamo.html',
  styleUrl: './observacion-reclamo.scss',
})
export class ObservacionReclamo implements OnInit {
  // VARIABLES DE ESTADO Y DATOS
  conteo: Conteo = {
    totalInstructor: 142,
    activoInstructor: 128,
    pendienteInstructor: 14
  };

  instructores: Instructor[] = [];          // Todos los datos originales
  instructoresFiltrados: Instructor[] = []; // Datos después de buscar/filtrar
  instructoresPaginados: Instructor[] = []; // Datos que se muestran en la página actual

  // VARIABLES DE PAGINACIÓN Y BÚSQUEDA
  terminoBusqueda: string = '';
  paginaActual: number = 1;
  totalPaginas: number = 1;
  elementosPorPagina: number = 4;

  // VARIABLES DEL OFF-CANVAS Y FILTROS
  mostrarFiltroAvanzado: boolean = false;
  seccionActiva: string = 'prioridad'; 

  // Modelos de los filtros
  filtroEstado: string = '';
  filtroPuntaje: string = '';
  filtroOrdenNombre: string = 'asc';
  filtroEspecialidad: string = '';

  especialidadesDisponibles: string[] = ['Fisioterapia', 'Neuromotricidad', 'Bio-Mecánica', 'Pilates'];

  constructor() { }

  ngOnInit(): void {
    this.cargarDatosMuestra();
    this.aplicarFiltroAvanzado(); // Para inicializar la tabla
  }

  // LÓGICA DEL PANEL OFF-CANVAS (ACORDEONES)
  toggleFiltroAvanzado(): void {
    this.mostrarFiltroAvanzado = !this.mostrarFiltroAvanzado;
  }

  toggleSeccion(seccion: string): void {
    this.seccionActiva = this.seccionActiva === seccion ? '' : seccion;
  }

  limpiarFiltros(): void {
    this.filtroEstado = '';
    this.filtroPuntaje = '';
    this.filtroOrdenNombre = 'asc';
    this.filtroEspecialidad = '';

    this.aplicarFiltroAvanzado();
  }

  aplicarFiltroAvanzado(): void {
    let resultado = [...this.instructores];

    if (this.terminoBusqueda) {
      const termino = this.terminoBusqueda.toLowerCase();
      resultado = resultado.filter(ins =>
        ins.nombreCompleto.toLowerCase().includes(termino) ||
        ins.idInstructor.toLowerCase().includes(termino)
      );
    }

    if (this.filtroEspecialidad) {
      resultado = resultado.filter(ins => ins.especialidad === this.filtroEspecialidad);
    }

    if (this.filtroEstado) {
      resultado = resultado.filter(ins => ins.estadoCuenta === this.filtroEstado);
    }

    if (this.filtroPuntaje) {
      resultado = resultado.filter(ins => {
        if (!ins.puntaje) {
          return this.filtroPuntaje === 'bajo';
        }

        switch (this.filtroPuntaje) {
          case 'alto':
            return ins.puntaje >= 4.5;
          case 'medio':
            return ins.puntaje >= 3.5 && ins.puntaje < 4.5;
          case 'bajo':
            return ins.puntaje < 3.5;
          default:
            return true;
        }
      });
    }

    resultado.sort((a, b) => {
      const nombreA = a.nombreCompleto.toLowerCase();
      const nombreB = b.nombreCompleto.toLowerCase();
      if (this.filtroOrdenNombre === 'asc') return nombreA.localeCompare(nombreB);
      else return nombreB.localeCompare(nombreA);
    });

    this.instructoresFiltrados = resultado;
    this.paginaActual = 1;
    this.actualizarPaginacion();

    if (this.mostrarFiltroAvanzado) {
      this.toggleFiltroAvanzado();
    }
  }

  // LÓGICA DE TABLA Y PAGINACIÓN
  buscar(termino: string): void {
    this.terminoBusqueda = termino;
    this.aplicarFiltroAvanzado();
  }

  irPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
    }
  }

  actualizarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.instructoresFiltrados.length / this.elementosPorPagina) || 1;
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.instructoresPaginados = this.instructoresFiltrados.slice(inicio, fin);
  }

  // UTILERÍAS VISUALES PARA EL HTML
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'ACTIVO': return 'status-activo';
      case 'SUSPENDIDO': return 'status-suspendido';
      case 'PENDIENTE': return 'status-pendiente';
      default: return '';
    }
  }

  getEstadoLabel(estado: string): string {
    return estado; 
  }

  getEstrellas(puntaje: number | null): string {
    if (!puntaje) return '☆☆☆☆☆';
    const estrellasLlenas = Math.round(puntaje);
    return '★'.repeat(estrellasLlenas) + '☆'.repeat(5 - estrellasLlenas);
  }

  exportarPDF(): void {
    const datosExportar = this.instructoresFiltrados.length > 0 ? this.instructoresFiltrados : this.instructores;
    const lineas = ['Reporte de observaciones', ''];

    datosExportar.forEach((ins, index) => {
      lineas.push(`${index + 1}. ${ins.nombreCompleto}`);
      lineas.push(`   ID: ${ins.idInstructor}`);
      lineas.push(`   Especialidad: ${ins.especialidad}`);
      lineas.push(`   Estado: ${ins.estadoCuenta}`);
      lineas.push(`   Puntaje: ${ins.puntaje ?? 'Sin puntaje'}`);
      lineas.push(`   Sesiones: ${ins.numeroSesion}`);
      lineas.push('');
    });

    const texto = lineas.join('\n');
    const contenidoPdf = texto
      .split('\n')
      .map((linea, index) => `BT /F1 10 Tf 50 ${780 - index * 14} Td (${linea.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')}) Tj ET`)
      .join('\n');

    const objects: string[] = [];
    objects.push('<< /Type /Catalog /Pages 2 0 R >>');
    objects.push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>');
    objects.push(`<< /Length ${contenidoPdf.length} >>\nstream\n${contenidoPdf}\nendstream`);
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
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `observaciones-export-${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
  }

  // DATOS MOCK (Basados en tu imagen)
  private cargarDatosMuestra(): void {
    this.instructores = [
      {
        idInstructor: '2024-001',
        nombreCompleto: 'Dr. Elena Rodríguez',
        urlImagen: 'assets/elena.png', // Reemplaza por URLs reales o variables genéricas
        especialidad: 'Fisioterapia',
        estadoCuenta: 'ACTIVO',
        puntaje: 4.8,
        numeroSesion: 156
      },
      {
        idInstructor: '2024-002',
        nombreCompleto: 'Marco Venz',
        urlImagen: 'assets/marco.png',
        especialidad: 'Neuromotricidad',
        estadoCuenta: 'SUSPENDIDO',
        puntaje: 3.2,
        numeroSesion: 42
      },
      {
        idInstructor: '2024-003',
        nombreCompleto: 'Carla Méndez',
        urlImagen: 'assets/carla.png',
        especialidad: 'Bio-Mecánica',
        estadoCuenta: 'PENDIENTE',
        puntaje: null,
        numeroSesion: 0
      },

      {
        idInstructor: '2024-004',
        nombreCompleto: 'Luis Chavez',
        urlImagen: 'assets/luis.png',
        especialidad: 'Pilates',
        estadoCuenta: 'ACTIVO',
        puntaje: 4.5,
        numeroSesion: 89
      },
      {
        idInstructor: '2024-005',
        nombreCompleto: 'Ana Silva',
        urlImagen: 'assets/ana.png',
        especialidad: 'Fisioterapia',
        estadoCuenta: 'ACTIVO',
        puntaje: 5.0,
        numeroSesion: 210
      }
    ];
  }
}