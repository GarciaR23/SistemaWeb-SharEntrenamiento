export interface DetalleRutinaPlanDto {
    idDetalleRutina: number;
    nombreEjercicio: string;
    tipoEjercicio: string | null;
    descripcionEjercicio: string | null;
    duracionEstimada: number | null;
}

export interface AjusteHojaRutaDto {
    idAjuste: number;
    idRuta: number;
    idEjercicioOriginal: number | null;
    nombreEjercicioOriginal: string | null;
    motivoCambio: string;
    motivoDetallado: string;
    ejercicioModificado: string;
    comentarioSupervisor: string | null;
    autorizadoPorInstructor: boolean | null;
    fechaAjuste: string;
}

export interface PlanTutorDto {
    idReserva: number;
    idRuta: number;
    idDetalle: number;

    idPaciente: number;
    pacienteNombre: string;

    idInstructor: number;
    instructorNombre: string;
    especialidad: string | null;
    imagenInstructor: string | null;

    idSede: number;
    nombreSede: string;
    descripcionSede: string | null;
    direccionSede: string;
    distritoSede: string;
    zonaSede: string | null;

    horaInicioEstimada: string;
    horaFinEstimada: string;

    estadoHoja: string;
    estadoDetalle: string;
    estadoSesion: string;
    pagoRegistrado: boolean;

    imagenesSede: string[];
    ejercicios: DetalleRutinaPlanDto[];
    ajustes: AjusteHojaRutaDto[];
}

export interface AjusteHojaRutaRequest {
    idEjercicioOriginal: number;
    motivoCambio: string;
    motivoDetallado: string;
    ejercicioModificado: string;
}