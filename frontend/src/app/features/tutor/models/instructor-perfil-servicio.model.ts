export interface InstructorPerfilServicioDto {
    idServicio: number;
    tarifaHora: number | null;
    horarioPreferencia: string | null;
    diaSemana: string | null;
    horarioInicio: string | null;
    horarioFinal: string | null;
}