import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { SolicitudInstructor } from '../models/solicitud.model';

export interface ConteoSolicitudes {
    totalPendientes: number;
    pendientesHoy: number;
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

    obtenerConteo(): Observable<ConteoSolicitudes> {
        return this.http.get<ConteoSolicitudes>(`${this.API_URL}/conteo`);
    }

    obtenerTodo(): Observable<{ solicitudes: SolicitudInstructor[], conteo: ConteoSolicitudes }> {
        return forkJoin({
            solicitudes: this.obtenerSolicitudes(),
            conteo: this.obtenerConteo()
        });
    }
}