import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolicitudRevision } from '../models/solicitud-revision.model';
import { FechaCritica } from '../models/fecha-critica.model';
import { ContadorPendiente, RecienteSemanal } from '../models/revision-contador.model';
import { RevisionDecisionRequest, RevisionDecisionResponse } from '../models/revision-decision.model';


@Injectable({
    providedIn: 'root'
})
export class RevisionService {
    private readonly baseUrl = 'http://localhost:8080/api/instructores/revision';

    constructor(private http: HttpClient) { }

    obtenerSolicitudesRevision(idInstructor: number): Observable<SolicitudRevision[]> {
        return this.http.get<SolicitudRevision[]>(`${this.baseUrl}/pacientes/${idInstructor}`);
    }

    obtenerFechaCritica(idReserva: number): Observable<FechaCritica> {
        return this.http.get<FechaCritica>(`${this.baseUrl}/fecha-critica/${idReserva}`);
    }

    decidirRevision(request: RevisionDecisionRequest): Observable<RevisionDecisionResponse> {
        return this.http.put<RevisionDecisionResponse>(`${this.baseUrl}/decidir`, request);
    }

    obtenerContadorPendiente(idInstructor: number): Observable<ContadorPendiente> {
        return this.http.get<ContadorPendiente>(`${this.baseUrl}/contador-pendiente/${idInstructor}`);
    }

    obtenerRecienteSemanal(idInstructor: number): Observable<RecienteSemanal[]> {
        return this.http.get<RecienteSemanal[]>(`${this.baseUrl}/reciente-semanal/${idInstructor}`);
    }
}