import { DetalleReservaRequest } from "./detalle-reserva-request.model";


export interface ReservaRequestDto {
    idPaciente: number;
    idInstructor: number;
    idSede: number;
    montoTotalAcumulado: number;
    detalles: DetalleReservaRequest[];
}