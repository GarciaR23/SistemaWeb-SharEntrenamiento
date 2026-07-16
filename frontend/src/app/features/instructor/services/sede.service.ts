import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SedeRequest, SedeResponse } from '../models/sede.model';

@Injectable({
  providedIn: 'root',
})

export class SedeService {
  private readonly baseUrl = 'http://localhost:8080/api/sedes';

  constructor(private http: HttpClient) { }

  listarPorInstructor(idInstructor: number): Observable<SedeResponse[]> {
    return this.http.get<SedeResponse[]>(`${this.baseUrl}/instructor/${idInstructor}`);
  }

  buscarPorDistrito(idInstructor: number, distrito: string): Observable<SedeResponse[]> {
    const params = new HttpParams().set('distrito', distrito);

    return this.http.get<SedeResponse[]>(
      `${this.baseUrl}/instructor/${idInstructor}/buscar/distrito`,
      { params }
    );
  }

  buscarPorDireccion(idInstructor: number, direccion: string): Observable<SedeResponse[]> {
    const params = new HttpParams().set('direccion', direccion);

    return this.http.get<SedeResponse[]>(
      `${this.baseUrl}/instructor/${idInstructor}/buscar/direccion`,
      { params }
    );
  }

  crearSede(request: SedeRequest): Observable<SedeResponse> {
    return this.http.post<SedeResponse>(this.baseUrl, request);
  }

  actualizarEstado(idSede: number, estadoActivacion: boolean): Observable<SedeResponse> {
    return this.http.put<SedeResponse>(`${this.baseUrl}/${idSede}/estado`, {
      estadoActivacion,
    });
  }
}