import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { DocumentoObservado } from '../models/documento-observado.model';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

interface CloudinaryResponse {
  url: string;
  publicId: string;
  resourceType: string;
  originalFilename: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubsanacionDocumentosService {
  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  obtenerDocumentosObservados(idInstructor: number): Observable<DocumentoObservado[]>{
    return this.http.get<DocumentoObservado[]>(
      `${this.apiUrl}/documentos/instructor/${idInstructor}/observados`);
  }

  subirArchivoCorregido(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CloudinaryResponse>(
      `${this.apiUrl}/cloudinary/files`, formData).pipe(
        map(response => response.url)
      );
  }

  actualizarDocumento(idDocumento: number, urlArchivo: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/documentos/${idDocumento}/corregir`,
      { urlArchivo }
    );
  }

  enviarCorrecciones(idInstructor: number, documentos: DocumentoObservado[]): Observable<any> {
    const documentosConArchivo = documentos.filter(doc => doc.archivoCorregido);

    const peticiones = documentosConArchivo.map(doc =>
        this.subirArchivoCorregido(doc.archivoCorregido!).pipe(
          switchMap(url => this.actualizarDocumento(doc.idDocumento, url))
        )
    );

    return forkJoin(peticiones).pipe(
      switchMap(() => this.http.post(
        `${this.apiUrl}/documentos/instructor/${idInstructor}/finalizar-correccion`, {})
      )
    );
  }
}
