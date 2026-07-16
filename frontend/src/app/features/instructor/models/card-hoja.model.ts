export interface CardHojaRuta {
    idDetalle: number;
    idReserva: number;
    idRuta: number | null;
    imagenPaciente: string;
    nombrePaciente: string;
    duracionEntrenamiento: string;
    nombreSede: string;
    condicion: string;
    clasificacion: string;
    estadoHoja: string;
    fechaCreacion: string;
}