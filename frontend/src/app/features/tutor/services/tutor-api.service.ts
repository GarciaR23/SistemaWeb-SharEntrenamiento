import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PacienteDto } from '../modules/paciente.model';

export interface TutorDto {
    idTutor: number;
    idUsuario: number;
    nombreCompleto: string;
}

@Injectable({
    providedIn: 'root',
})
export class TutorApiService {
    private readonly tutoresUrl = 'http://localhost:8080/api/tutores';
    private readonly pacientesUrl = 'http://localhost:8080/api/pacientes';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken_tutor');

        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
    }

    getTutorPorUsuario(idUsuario: number): Observable<TutorDto> {
        return this.http.get<TutorDto>(
            `${this.tutoresUrl}/usuario/${idUsuario}`,
            {
                headers: this.getAuthHeaders(),
            }
        );
    }

    getPacientesPorTutor(idTutor: number): Observable<PacienteDto[]> {
        return this.http.get<PacienteDto[]>(
            `${this.pacientesUrl}/tutor/${idTutor}`,
            {
                headers: this.getAuthHeaders(),
            }
        );
    }
}