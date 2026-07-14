import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertaPendiente } from '../models/alerta-pendiente.model';

@Injectable({
    providedIn: 'root'
})
export class AlertasService {
    private readonly baseUrl = 'http://localhost:8080/api/instructores/analitica';

    constructor(private http: HttpClient) { }

    obtenerAlertasPendientes(idInstructor: number): Observable<AlertaPendiente[]> {
        return this.http.get<AlertaPendiente[]>(`${this.baseUrl}/alertas-pendientes/${idInstructor}`);
    }
}