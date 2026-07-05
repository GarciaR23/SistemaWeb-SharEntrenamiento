import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProgresoKpiResponse {
    promedioCoordinacion: number;
    promedioEquilibrio: number;
    promedioResistencia: number;
    totalReportesEvaluados: number;
    tendenciaCoordinacion: number;
    tendenciaEquilibrio: number;
    tendenciaResistencia: number;
}

@Injectable({ providedIn: 'root' })
export class ProgresoKpiService {
    private readonly baseUrl = 'http://localhost:8080/api/tutores/progreso/paciente';

    constructor(private http: HttpClient) { }

    obtenerKpi(idPaciente: number): Observable<ProgresoKpiResponse> {
        return this.http.get<ProgresoKpiResponse>(`${this.baseUrl}/${idPaciente}/kpi`);
    }
}