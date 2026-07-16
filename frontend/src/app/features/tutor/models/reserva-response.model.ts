import { DetalleReservaResponse } from "./detalle-reserva-response.model";

export interface ReservaResponseDto {
    idReserva: number;
    idPaciente: number;
    idInstructor: number;
    idSede: number;
    totalHorasAcumuladas: string;
    montoTotalAcumulado: number;
    fechaCreacion: string;
    detalles: DetalleReservaResponse[];
}