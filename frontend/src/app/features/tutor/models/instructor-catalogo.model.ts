export interface InstructorCatalogoDto {
    idInstructor: number;
    nombreCompleto: string;
    urlImagenPerfil: string | null;
    especialidad: string | null;
    biografia: string | null;
    distrito: string | null;
    direccion: string | null;

    idSede: number | null;
    direccionSede: string | null;
    distritoSede: string | null;

    tarifaHora: number | null;
    horarioPreferencia: string | null;
    diaDisponible: string | null;
    horarioInicio: string | null;
    horarioFinal: string | null;

    promedioCalificacion: number | null;
    totalSesiones: number | null;

}