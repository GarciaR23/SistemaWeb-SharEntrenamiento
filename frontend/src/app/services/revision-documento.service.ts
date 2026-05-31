import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DocumentoDto {
    idDocumento: number;
    idInstructor: number;
    nombreDocumento: string;
    urlArchivo: string;
    estadoAprobacion: string;
    fechaSubida: string;
}

export interface RevisionDocumentoResponse {
    idInstructor: number;
    documentos: DocumentoDto[];
}

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