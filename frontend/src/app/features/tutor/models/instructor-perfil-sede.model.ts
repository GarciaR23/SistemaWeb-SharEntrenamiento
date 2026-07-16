export interface InstructorPerfilSedeDto {
    idSede: number;
    urlImagenSede1: string | null;
    urlImagenSede2: string | null;
    urlImagenSede3: string | null;
    nombreSede: string | null;
    descripcionSede: string | null;
    direccionSede: string | null;
    distritoSede: string | null;
    zonaSede: string | null;
    estadoActivacion: boolean | null;
}