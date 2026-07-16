export interface Notificacion {
    idReferencia: number;
    titulo: string;
    mensaje: string;
    tipo: string;
    fecha: string;
}

export interface NotificacionesResponse {
    notificaciones: Notificacion[];
    total: number;
}