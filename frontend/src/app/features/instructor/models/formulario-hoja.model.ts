import { SedeResumen } from "./sede-formulario.model";

export interface FormularioHojaRuta {
    idDetalle: number;
    imagenPaciente: string;
    nombrePaciente: string;
    duracionEntrenamiento: string;
    sedeSeleccionada: SedeResumen;
}