export interface PacienteDto {
    idPaciente: number;
    idTutor: number;
    nombreCompleto: string;
    urlImagenPaciente: string | null;
    condicion: string;
    gradoAutismo: string;
    genero: string;
    edad: number;
    distrito: string;
    direccion: string;
}
