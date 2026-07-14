import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgendaHoy } from '../models/agenda-hoy.model';

@Injectable({
    providedIn: 'root'
})
export class AgendaService {
    private readonly baseUrl = 'http://localhost:8080/api/instructores/analitica';

    constructor(private http: HttpClient) { }

    obtenerAgendaHoy(idInstructor: number): Observable<AgendaHoy[]> {
        return this.http.get<AgendaHoy[]>(`${this.baseUrl}/agenda-hoy/${idInstructor}`);
    }
}