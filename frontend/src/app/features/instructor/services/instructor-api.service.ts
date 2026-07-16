
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InstructorDto } from '../models/instructor.model';

@Injectable({
    providedIn: 'root',
})
export class InstructorApiService {
    private readonly instructoresUrl = 'http://localhost:8080/api/instructores';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken_instructor');

        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
    }

    getInstructores(): Observable<InstructorDto[]> {
        return this.http.get<InstructorDto[]>(this.instructoresUrl, {
            headers: this.getAuthHeaders(),
        });
    }

    getInstructorById(id: number): Observable<InstructorDto> {
        return this.http.get<InstructorDto>(`${this.instructoresUrl}/${id}`, {
            headers: this.getAuthHeaders(),
        });
    }
}