export interface DashboardExportRequest {
    fechaInicio: string;
    fechaFin: string;
}

export interface CrecimientoInstructor {
    mes: string;
    totalNuevos: number;
}

export interface EstadoSolicitud {
    estado: string;
    porcentaje: number;
}