import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardInstructores } from '../models/admin-dashboard.model';
import { DashboardEstadoSolicitud } from '../models/estado-solicitud.model';
import { PacienteControl } from '../models/paciente-control.model';

@Injectable({
    providedIn: 'root'
})
export class AdminDashboardService {
    private readonly baseUrl = 'http://localhost:8080/api/admin/dashboard';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken_admin');
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

    obtenerControlPacientes(): Observable<PacienteControl> {
        return this.http.get<PacienteControl>(`${this.baseUrl}/control-pacientes`, { headers: this.getHeaders() });
    }

    obtenerDashboardInstructores(fechaInicio?: string, fechaFin?: string): Observable<DashboardInstructores> {
        let params = new HttpParams();
        if (fechaInicio) params = params.set('fechaInicio', fechaInicio + 'T00:00:00');
        if (fechaFin) params = params.set('fechaFin', fechaFin + 'T23:59:59');
        return this.http.get<DashboardInstructores>(`${this.baseUrl}/instructores`, { headers: this.getHeaders(), params });
    }

    obtenerEstadoSolicitudes(): Observable<DashboardEstadoSolicitud> {
        return this.http.get<DashboardEstadoSolicitud>(`${this.baseUrl}/estado-solicitudes`, { headers: this.getHeaders() });
    }
}