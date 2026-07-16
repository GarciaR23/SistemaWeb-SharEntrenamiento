export interface RevisionDecisionRequest {
    idDetalle: number;
    aprobada: boolean;
}

export interface RevisionDecisionResponse {
    idDetalle: number;
    idReserva: number;
    estadoDetalle: string;
    fechaRevision: string;
}