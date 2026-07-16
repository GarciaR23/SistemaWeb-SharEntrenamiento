export interface PropuestaReprogramacionDto {
    idDetalleReprogramar: number;
    idReprogramar: number;
    fechaPropuesta: string;
    horaInicioPropuesta: string;
    horaFinPropuesta: string;
    esSeleccionada: boolean;
}

export interface ActividadTutorDto {
    idReserva: number;
    idDetalle: number;
    idSesion: number | null;

    idPaciente: number;
    idInstructor: number;
    idSede: number;

    pacienteNombre: string;
    pacienteEdad: number | null;
    pacienteImagen: string | null;

    instructorNombre: string;
    especialidad: string | null;

    nombreSede: string;
    direccionSede: string;

    horaInicioEstimada: string;
    horaFinEstimada: string;
    duracionMinutos: number;
    montoSubtotal: number;

    estadoDetalle: string;
    estadoSesion: string;
    estadoHoja: string;

    hojaRutaAceptada: boolean;
    pagoRegistrado: boolean;

    idReprogramar: number | null;
    motivoReprogramacion: string | null;
    respuestaTutor: boolean | null;

    contactoEmergenciaNombre: string | null;
    contactoEmergenciaTelefono: string | null;
    contactoEmergenciaRelacion: string | null;
    protocoloEmergencia: string | null;

    propuestas: PropuestaReprogramacionDto[];

    mostrarAsistencia?: boolean;
    segundosRestantes?: number;
    tiempoCumplido?: boolean;
}

export interface AvanceEjercicioReporteDto {
    idDetalleRutina: number;
    nombreEjercicio: string;
    tipoEjercicio: string;
    descripcionEjercicio: string | null;
    estadoEjercicio: string;
}

export interface ReporteTecnicoDto {
    idReporte: number;
    idReserva: number;
    idPaciente: number;

    horaInicioReal: string;
    horaFinalReal: string;

    respuestaAuditiva: string;
    respuestaVisual: string;
    compromisoSesion: number;

    puntajeCoordinacion: number | null;
    puntajeEquilibrio: number | null;
    puntajeResistencia: number | null;

    observacionTecnica: string | null;
    recommendaciones: string | null;
    fechaRegistro: string;

    tuvoColapso: boolean;
    descripcionColapso: string | null;
    minutoColapso: string | null;

    ejercicios: AvanceEjercicioReporteDto[];
}