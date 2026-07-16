export interface ReporteColumna {
    key: string;
    label: string;
    tipo?: 'texto' | 'estado' | 'puntaje' | 'imagen';
}

export interface OpcionExportacion {
    formato: 'pdf' | 'excel';
    icono: string;
    label: string;
}