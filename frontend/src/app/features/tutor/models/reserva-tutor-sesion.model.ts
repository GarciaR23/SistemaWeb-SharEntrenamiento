export interface ReservaTutorSesionDto {
    idReserva: number;
    idDetalle: number;
    idPaciente: number;
    pacienteNombre: string;
    pacienteImagen: string | null;
    idInstructor: number;
    instructorNombre: string;
    instructorImagen: string | null;
    especialidad: string | null;
    idSede: number;
    nombreSede: string | null;
    direccionSede: string | null;
    horaInicioEstimada: string;
    horaFinEstimada: string;
    duracionMinutos: number;
    montoSubtotal: number;
    estadoReserva: string;
    estadoSesion: string;
    fechaCreacion: string;
}