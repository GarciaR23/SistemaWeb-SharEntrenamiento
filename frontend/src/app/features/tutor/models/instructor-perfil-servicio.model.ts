export interface InstructorPerfilServicioDto {
    idServicio: number;
    tarifaHora: number | null;
    horarioPreferencia: string | null;
    diaDisponible: string | null;
    horarioInicio: string | null;
    horarioFinal: string | null;
}