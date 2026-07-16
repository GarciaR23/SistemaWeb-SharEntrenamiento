export interface InstructorPerfilHorarioDto {
    diaSemana: string | null;
    horarioInicio: string | null;
    horarioFinal: string | null;
    horarioPreferencia: string | null;
}

export interface InstructorPerfilServicioDto {
    idServicio: number;
    tarifaHora: number | null;

    horarioPreferencia?: string | null;
    diaSemana?: string | null;
    diaDisponible?: string | null;
    horarioInicio?: string | null;
    horarioFinal?: string | null;

    horarios?: InstructorPerfilHorarioDto[];
}