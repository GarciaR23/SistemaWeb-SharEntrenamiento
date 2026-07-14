export interface DetalleRutina {
    idDetalle: number;
    idRuta: number;
    nombreEjercicio: string;
    tipoEjercicio: string;
    descripcionEjercicio: string;
    duracionEstimada: string;
}

export interface DetalleRutinaRequest {
    idRuta: number;
    nombreEjercicio: string;
    tipoEjercicio: string;
    descripcionEjercicio: string;
    duracionEstimada: string;
}