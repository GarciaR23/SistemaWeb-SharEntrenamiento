export interface InstructorPerfilCalificacionDto {
    idCalificacion: number;
    idPaciente: number;
    pacienteNombre: string;
    puntajeEstrellas: number;
    comentarioTutor: string | null;
    fechaCalificacion: string;
}