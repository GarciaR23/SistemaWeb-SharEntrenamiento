import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    AjusteHojaRutaRequest,
    PlanTutorDto
} from '../models/plan-tutor.model';

@Injectable({
    providedIn: 'root'
})
export class PlanApiService {
    private readonly apiUrl = 'http://localhost:8080/api/plan';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken_tutor');

        return new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
    }

    getPlanPorReserva(idReserva: number): Observable<PlanTutorDto> {
        return this.http.get<PlanTutorDto>(
            `${this.apiUrl}/reserva/${idReserva}`,
            { headers: this.getAuthHeaders() }
        );
    }

    getPlanesPorTutor(idTutor: number): Observable<PlanTutorDto[]> {
        return this.http.get<PlanTutorDto[]>(
            `${this.apiUrl}/tutor/${idTutor}`,
            { headers: this.getAuthHeaders() }
        );
    }

    getPlanesPorUsuario(idUsuario: number): Observable<PlanTutorDto[]> {
        return this.http.get<PlanTutorDto[]>(
            `${this.apiUrl}/usuario/${idUsuario}`,
            { headers: this.getAuthHeaders() }
        );
    }

    marcarComoVisto(idReserva: number): Observable<PlanTutorDto> {
        return this.http.put<PlanTutorDto>(
            `${this.apiUrl}/reserva/${idReserva}/visto`,
            {},
            { headers: this.getAuthHeaders() }
        );
    }

    solicitarAjuste(
        idReserva: number,
        idRuta: number,
        request: AjusteHojaRutaRequest
    ): Observable<PlanTutorDto> {
        return this.http.post<PlanTutorDto>(
            `${this.apiUrl}/reserva/${idReserva}/ruta/${idRuta}/ajustes`,
            request,
            { headers: this.getAuthHeaders() }
        );
    }

    aceptarHojaRuta(idRuta: number): Observable<void> {
        return this.http.put<void>(
            `${this.apiUrl}/${idRuta}/aceptar`,
            {},
            { headers: this.getAuthHeaders() }
        );
    }
}