import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HistorialRespuesta {
    comentario: string;
    fecha: string;
}

@Injectable({
    providedIn: 'root'
})
export class HistorialRespuestaService {
    private baseUrl = 'http://localhost:8080/api/admin/revisiones';

    constructor(private http: HttpClient) { }

    evaluarDocumento(idInst: number, idDoc: number, estado: string, idAdmin: number, comentario?: string): Observable<any> {
        let url = `${this.baseUrl}/instructor/${idInst}/documento/${idDoc}?estado=${estado}&idAdmin=${idAdmin}`;
        if (comentario) {
            url += `&comentario=${encodeURIComponent(comentario)}`;
        }
        return this.http.post(url, null);
    }

    obtenerHistorialRechazosPorDocumento(idDocumento: number): Observable<HistorialRespuesta[]> {
        return this.http.get<HistorialRespuesta[]>(`${this.baseUrl}/documento/${idDocumento}/historial-rechazos`);
    }
}