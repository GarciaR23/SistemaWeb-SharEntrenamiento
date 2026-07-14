import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetalleRutina, DetalleRutinaRequest } from '../models/detalle-rutina.model';
import { CardHojaRuta } from '../models/card-hoja.model';
import { FormularioHojaRuta } from '../models/formulario-hoja.model';

export interface ContadorHojas {
    porConfigurar: number;
    completado: number;
    conObservacion: number;
}

@Injectable({
    providedIn: 'root'
})
export class HojaRutaService {
    private readonly baseUrl = 'http://localhost:8080/api/hoja-ruta';
    private readonly detalleUrl = 'http://localhost:8080/api/detalle-rutina';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken_instructor');
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

    obtenerCardsClasificadas(idInstructor: number): Observable<CardHojaRuta[]> {
        return this.http.get<CardHojaRuta[]>(`${this.baseUrl}/cards-clasificadas/${idInstructor}`, { headers: this.getAuthHeaders() });
    }

    obtenerContadorHojas(idInstructor: number): Observable<ContadorHojas> {
        return this.http.get<ContadorHojas>(`${this.baseUrl}/contador-hojas/${idInstructor}`, { headers: this.getAuthHeaders() });
    }

    obtenerFormulario(idDetalle: number): Observable<FormularioHojaRuta> {
        return this.http.get<FormularioHojaRuta>(`${this.baseUrl}/formulario/${idDetalle}`, { headers: this.getAuthHeaders() });
    }

    enviarHojaRuta(idRuta: number): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${idRuta}/enviar`, {}, { headers: this.getAuthHeaders() });
    }

    obtenerEjercicios(idRuta: number): Observable<DetalleRutina[]> {
        return this.http.get<DetalleRutina[]>(`${this.detalleUrl}/ruta/${idRuta}`, { headers: this.getAuthHeaders() });
    }

    agregarEjercicio(request: DetalleRutinaRequest): Observable<DetalleRutina> {
        return this.http.post<DetalleRutina>(this.detalleUrl, request, { headers: this.getAuthHeaders() });
    }

    eliminarEjercicio(idDetalle: number): Observable<void> {
        return this.http.delete<void>(`${this.detalleUrl}/${idDetalle}`, { headers: this.getAuthHeaders() });
    }
}