import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SolicitudInstructor {
    idInstructor: number;
    instructorNombre: string;
    urlImagenPerfil: string;
    especialidad: string;
    estadoUsuario: string;
    totalDocumentosEnviados: number;
    fechaUltimoEnvio: string;
}

@Injectable({
    providedIn: 'root'
})
export class SolicitudesService {
    private readonly API_URL = 'http://localhost:8080/api/admin/solicitudes';

    constructor(private http: HttpClient) { }

    obtenerSolicitudes(): Observable<SolicitudInstructor[]> {
        return this.http.get<SolicitudInstructor[]>(this.API_URL);
    }
}