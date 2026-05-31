import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RespuestaDocumentoService {
    private baseUrl = 'http://localhost:8080/api/admin/revisiones';

    constructor(private http: HttpClient) { }

    evaluarDocumento(idInst: number, idDoc: number, estado: string, idAdmin: number, comentario?: string): Observable<any> {
        let url = `${this.baseUrl}/instructor/${idInst}/documento/${idDoc}?estado=${estado}&idAdmin=${idAdmin}`;
        if (comentario) {
            url += `&comentario=${encodeURIComponent(comentario)}`;
        }
        return this.http.post(url, null);
    }
}