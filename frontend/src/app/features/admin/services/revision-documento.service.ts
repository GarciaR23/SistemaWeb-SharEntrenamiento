import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RevisionDocumentoResponse } from '../models/revision.model';

@Injectable({
    providedIn: 'root'
})
export class RevisionDocumentoService {
    private readonly API_URL = 'http://localhost:8080/api/documentos';

    constructor(private readonly http: HttpClient) { }

    obtenerRevisionPorInstructorId(idInstructor: number): Observable<RevisionDocumentoResponse> {
        return this.http.get<RevisionDocumentoResponse>(`${this.API_URL}/instructor/${idInstructor}/modal`);
    }
}