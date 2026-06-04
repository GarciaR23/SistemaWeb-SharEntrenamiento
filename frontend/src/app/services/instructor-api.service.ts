import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InstructorDto {
    idInstructor: number;
    idUsuario: number;
    nombreCompleto: string;
    urlImagenPerfil: string | null;
    especialidad: string;
    biografiaInstructor: string;
    distrito: string;
    direccion: string;
}

@Injectable({
    providedIn: 'root',
})
export class InstructorApiService {
    private readonly instructoresUrl = 'http://localhost:8080/api/instructores';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken_tutor');

        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
    }

    getInstructores(): Observable<InstructorDto[]> {
        return this.http.get<InstructorDto[]>(this.instructoresUrl, {
            headers: this.getAuthHeaders(),
        });
    }
}