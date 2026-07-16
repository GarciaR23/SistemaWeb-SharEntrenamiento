import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificacionesResponse } from '../models/notificacion.model';

@Injectable({ providedIn: 'root' })
export class NotificacionService {
    private readonly baseUrl = 'http://localhost:8080/api/notificaciones';

    constructor(private http: HttpClient) { }

    private getHeaders(rol: string): HttpHeaders {
        const token = localStorage.getItem(`authToken_${rol}`);
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

    obtenerNotificacionesAdmin(): Observable<NotificacionesResponse> {
        return this.http.get<NotificacionesResponse>(`${this.baseUrl}/admin`, {
            headers: this.getHeaders('admin')
        });
    }

    obtenerNotificacionesInstructor(idInstructor: number): Observable<NotificacionesResponse> {
        return this.http.get<NotificacionesResponse>(`${this.baseUrl}/instructor/${idInstructor}`, {
            headers: this.getHeaders('instructor')
        });
    }

    obtenerNotificacionesPaciente(idPaciente: number): Observable<NotificacionesResponse> {
        return this.http.get<NotificacionesResponse>(`${this.baseUrl}/paciente/${idPaciente}`, {
            headers: this.getHeaders('tutor')
        });
    }
}