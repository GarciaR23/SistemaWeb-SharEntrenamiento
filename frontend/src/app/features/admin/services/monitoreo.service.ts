import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InstructorMonitoreo } from '../models/instructor-monitoreo.model';
import { PacienteMonitoreo } from '../models/paciente-monitoreo.model';

export interface ConteoInstructor {
    totalInstructor: number;
    activoInstructor: number;
    pendienteInstructor: number;
}

export interface ConteoPaciente {
    totalPaciente: number;
    activoPaciente: number;
    inactivos60Dias: number;
}

@Injectable({ providedIn: 'root' })
export class MonitoreoService {
    private readonly baseUrl = 'http://localhost:8080/api/admin/monitoreo';

    constructor(private http: HttpClient) { }

    obtenerInstructores(): Observable<InstructorMonitoreo[]> {
        return this.http.get<InstructorMonitoreo[]>(`${this.baseUrl}/instructor`);
    }

    obtenerConteoInstructor(): Observable<ConteoInstructor> {
        return this.http.get<ConteoInstructor>(`${this.baseUrl}/instructor/conteo`);
    }

    obtenerPacientes(): Observable<PacienteMonitoreo[]> {
        return this.http.get<PacienteMonitoreo[]>(`${this.baseUrl}/paciente`);
    }

    obtenerConteoPaciente(): Observable<ConteoPaciente> {
        return this.http.get<ConteoPaciente>(`${this.baseUrl}/paciente/conteo`);
    }
}