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

    /*SE MANEJA LA APROBACIÓN Y RESPUESTA DE LOS DOCUMENTOS - rechazado*/
    evaluarDocumento(idInst: number, idDoc: number, estado: string, idAdmin: number, comentario?: string): Observable<any> {
        let url = `${this.baseUrl}/instructor/${idInst}/documento/${idDoc}?estado=${estado}&idAdmin=${idAdmin}`;
        if (comentario) {
            url += `&comentario=${encodeURIComponent(comentario)}`;
        }
        return this.http.post(url, null);
    }

    /*SE MANEJA EL HISTORIAL DE RESPUESTA DE RECHAZOS*/
    obtenerHistorialRechazosPorDocumento(idDocumento: number): Observable<HistorialRespuesta[]> {
        return this.http.get<HistorialRespuesta[]>(`${this.baseUrl}/documento/${idDocumento}/historial-rechazos`);
    }

    /*SERVIRÁ PARA RECIBIR QUE DOCUMENTOS RECHAZADOS POR PARTE DEL ADMIN EN EL LOGIN*/
    obtenerDocumentosRechazados(idInstructor: number): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/instructor/${idInstructor}/documentos-rechazados`);
    }

    /*CUANDO TERMINA DE REVISAR LOS CUATROS DOCUMENTOS*/
    finalizarRevision(idInstructor: number): Observable<any> {
        return this.http.post(`${this.baseUrl}/instructor/${idInstructor}/finalizar`, null);
    }
}