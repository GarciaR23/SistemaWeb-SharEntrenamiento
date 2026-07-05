export interface InstructorPerfilCalificacionDto {
    idCalificacion: number;
    idPaciente: number;
    pacienteNombre: string;
    puntajeEstrellas: number | null;
    comentarioCliente: string | null;
    fechaCalificacion: string | null;
}