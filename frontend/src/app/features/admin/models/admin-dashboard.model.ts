export interface CrecimientoInstructor {
    mes: string;
    totalNuevos: number;
}

export interface DashboardInstructores {
    crecimiento: CrecimientoInstructor[];
    porcentajeMensual: number;
}