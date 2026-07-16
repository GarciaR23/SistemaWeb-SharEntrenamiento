import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Observacion, ContadorObservaciones } from '../models/observacion.model';

@Injectable({ providedIn: 'root' })
export class ObservacionService {
    private readonly baseUrl = 'http://localhost:8080/api/admin/observaciones';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken_admin');
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

    obtenerContadores(): Observable<ContadorObservaciones> {
        return this.http.get<ContadorObservaciones>(`${this.baseUrl}/contadores`, { headers: this.getHeaders() });
    }

    obtenerObservaciones(): Observable<Observacion[]> {
        return this.http.get<Observacion[]>(`${this.baseUrl}/tabla`, { headers: this.getHeaders() });
    }

    actualizarAccion(idIncidencia: number, accion: string): Observable<any> {
        return this.http.put(`${this.baseUrl}/${idIncidencia}/accion`, { accion }, { headers: this.getHeaders() });
    }
}