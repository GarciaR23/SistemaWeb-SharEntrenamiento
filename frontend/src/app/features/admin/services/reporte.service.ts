import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { ReporteConfig } from '../models/reporte-config.model';

@Injectable({ providedIn: 'root' })
export class ReporteService {

    generarPDF(config: ReporteConfig): void {
        const { titulo, columnas, datos, filtrosAplicados, resumen } = config;
        const fecha = new Date().toLocaleString('es-PE');

        let html = `
    <!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${titulo}</title>
    <style>
      body { font-family: 'Segoe UI', sans-serif; margin: 40px; color: #070a13; }
      .header { border-bottom: 2px solid #070a13; padding-bottom: 20px; display: flex; justify-content: space-between; }
      .logo { width: 80px; height: 40px; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; }
      .params { background: #f8fafc; padding: 16px; border: 1px solid #e2e8f0; margin: 24px 0; display: flex; gap: 24px; flex-wrap: wrap; }
      .kpi { border-left: 3px solid #00e59b; padding-left: 10px; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th { background: #070a13; color: #fff; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; }
      td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
      .estado-activo { color: #00e59b; font-weight: bold; }
      .estado-pendiente { color: #f59e0b; font-weight: bold; }
      .estado-observado { color: #ef4444; font-weight: bold; }
      .estado-suspendido { color: #64748b; font-weight: bold; }
    </style></head><body>
    <header class="header">
      <div class="logo">LOGO</div>
      <div style="text-align:right;"><h2 style="margin:0;">${titulo}</h2><p style="font-size:12px;">Emisión: ${fecha}</p></div>
    </header>`;

        if (filtrosAplicados?.length || resumen?.length) {
            html += '<section class="params">';
            if (filtrosAplicados?.length) {
                html += `<div><strong>Filtros aplicados:</strong><br><small>${filtrosAplicados.map(f => f.label + ': ' + f.valor).join(' | ')}</small></div>`;
            }
            if (resumen?.length) {
                resumen.forEach(r => {
                    html += `<div class="kpi"><strong>${r.label}:</strong><br>${r.valor}</div>`;
                });
            }
            html += '</section>';
        }

        html += '<table><thead><tr>';
        columnas.forEach(c => html += `<th>${c.label}</th>`);
        html += '</tr></thead><tbody>';

        datos.forEach((row, i) => {
            html += '<tr>';
            columnas.forEach(c => {
                const valor = row[c.key] ?? '';
                if (c.tipo === 'estado') {
                    const cls = this.getEstadoClass(valor);
                    html += `<td><span class="${cls}">${valor}</span></td>`;
                } else if (c.tipo === 'puntaje') {
                    html += `<td>${'★'.repeat(Math.round(valor))}${'☆'.repeat(5 - Math.round(valor))} ${valor}</td>`;
                } else if (c.tipo === 'imagen') {
                    html += `<td><img src="${valor}" width="30" height="30" style="border-radius:50%;" /></td>`;
                } else {
                    html += `<td>${valor}</td>`;
                }
            });
            html += '</tr>';
        });

        html += '</tbody></table></body></html>';

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const win = window.open(url, '_blank');
        if (win) setTimeout(() => win.print(), 500);
    }

    generarExcel(config: ReporteConfig): void {
        const { titulo, columnas, datos } = config;
        const headers = columnas.map(c => c.label);
        const rows = datos.map(row => columnas.map(c => row[c.key] ?? ''));

        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
        XLSX.writeFile(wb, `${titulo.replace(/\s/g, '_')}.xlsx`);
    }

    private getEstadoClass(estado: string): string {
        switch (estado?.toLowerCase()) {
            case 'activo': return 'estado-activo';
            case 'pendiente': case 'pendiente_validacion': return 'estado-pendiente';
            case 'observado': case 'pendiente_subsanacion': return 'estado-observado';
            case 'suspendido': return 'estado-suspendido';
            default: return '';
        }
    }
}