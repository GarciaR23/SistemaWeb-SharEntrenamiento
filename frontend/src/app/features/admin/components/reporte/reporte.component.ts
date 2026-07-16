import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../services/reporte.service';
import { OpcionExportacion } from '../../models/reporte-columna.model';
import { ReporteConfig } from '../../models/reporte-config.model';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent {
  @Input() config: ReporteConfig | null = null;

  mostrarPreview = false;
  formatoSeleccionado: 'pdf' | 'excel' | null = null;

  opciones: OpcionExportacion[] = [
    { formato: 'pdf', icono: 'file-text', label: 'PDF' },
    { formato: 'excel', icono: 'table', label: 'Excel' }
  ];

  constructor(private reporteService: ReporteService) { }

  getIconoSVG(icono: string): string {
    if (icono === 'file-text') {
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
      </svg>`;
    }
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
    </svg>`;
  }

  redondear(valor: number): number {
    return Math.round(valor || 0);
  }

  repeat(count: number): number[] {
    return Array(Math.max(0, Math.round(count))).fill(0);
  }

  obtenerFiltrosTexto(): string {
    if (!this.config?.filtrosAplicados?.length) return '';
    return this.config.filtrosAplicados.map(f => f.valor).join(', ');
  }

  obtenerEstadoClass(estado: string): string {
    return estado?.toLowerCase() || '';
  }

  abrirPreview(): void {
    this.mostrarPreview = true;
  }

  cerrarPreview(): void {
    this.mostrarPreview = false;
    this.formatoSeleccionado = null;
  }

  seleccionarFormato(formato: 'pdf' | 'excel'): void {
    this.formatoSeleccionado = formato;
  }

  exportar(): void {
    if (!this.config || !this.formatoSeleccionado) return;

    if (this.formatoSeleccionado === 'pdf') {
      this.reporteService.generarPDF(this.config);
    } else {
      this.reporteService.generarExcel(this.config);
    }

    this.cerrarPreview();
  }

  get totalRegistros(): number {
    return this.config?.datos?.length || 0;
  }
}