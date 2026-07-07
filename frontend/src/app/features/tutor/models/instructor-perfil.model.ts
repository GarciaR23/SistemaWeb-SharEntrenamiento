export interface InstructorPerfilHorarioDto {
    diaSemana: string | null;
    horarioPreferencia: string | null;
    horarioInicio: string | null;
    horarioFinal: string | null;
}

export interface InstructorPerfilServicioDto {
    idServicio: number;
    tarifaHora: number | null;

    horarios?: InstructorPerfilHorarioDto[];
    diaDisponible?: string | null;
    horarioPreferencia?: string | null;
    horarioInicio?: string | null;
    horarioFinal?: string | null;
}
export interface InstructorPerfilResumenDto {
    idInstructor: number;
    nombreCompleto: string;
    urlImagenPerfil: string | null;
    especialidad: string | null;
    biografia: string | null;
    direccion: string | null;
    distrito: string | null;
}