export interface InstructorDto {
    idInstructor: number;
    idUsuario: number;
    nombreCompleto: string;
    urlImagenPerfil: string | null;
    especialidad: string;
    biografiaInstructor: string;
    distrito: string;
    direccion: string;
}