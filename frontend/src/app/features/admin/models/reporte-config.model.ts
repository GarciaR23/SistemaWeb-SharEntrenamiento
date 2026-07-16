import { ReporteColumna } from "./reporte-columna.model";

export interface ReporteConfig {
    titulo: string;
    tipo: 'instructores' | 'pacientes';
    columnas: ReporteColumna[];
    datos: any[];
    filtrosAplicados?: { label: string; valor: string }[];
    resumen?: { label: string; valor: string }[];
}