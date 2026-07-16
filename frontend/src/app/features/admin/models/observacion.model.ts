export interface Observacion {
    idIncidencia: number;
    idSesion: number | null;
    tipoReclamo: string;
    fotoPaciente: string;
    nombrePaciente: string;
    fotoInstructor: string;
    nombreInstructor: string;
    detalleReclamo: string;
    nivelGravedad: string;
    urlEvidencia1: string | null;
    urlEvidencia2: string | null;
    urlEvidencia3: string | null;
    accionSugerida: string;
}

export interface ContadorObservaciones {
    totalCasos: number;
    enMediacion: number;
    rechazados: number;
}