import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgresoKpiResponse } from '../models/progreso-kpi-response.model';


@Injectable({ providedIn: 'root' })
export class ProgresoKpiService {
    private readonly baseUrl = 'http://localhost:8080/api/tutores/progreso/paciente';

    constructor(private http: HttpClient) { }

    obtenerKpi(idPaciente: number): Observable<ProgresoKpiResponse> {
        return this.http.get<ProgresoKpiResponse>(`${this.baseUrl}/${idPaciente}/kpi`);
    }
}