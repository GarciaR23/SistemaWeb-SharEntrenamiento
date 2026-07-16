export interface EstadoSolicitud {
    estado: string;
    porcentaje: number;
}

export interface DashboardEstadoSolicitud {
    estados: EstadoSolicitud[];
    totalSolicitudes: number;
}