import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PacienteDto } from '../models/paciente.model';
import { InstructorCatalogoDto } from '../models/instructor-catalogo.model';
import { InstructorPerfilSedeDto } from '../models/instructor-perfil-sede.model';
import { InstructorPerfilResumenDto } from '../models/instructor-perfil.model';
import { InstructorPerfilCalificacionDto } from '../models/instructor-perfil-calificacion.model';
import { InstructorPerfilServicioDto } from '../models/instructor-perfil-servicio.model';
import { ReservaTutorSesionDto } from '../models/reserva-tutor-sesion.model';
import { ReservaRequestDto } from '../models/reserva-request.model';
import { ReservaResponseDto } from '../models/reserva-response.model';

export interface TutorDto {
    idTutor: number;
    idUsuario: number;
    nombreCompleto: string;
}

@Injectable({
    providedIn: 'root',
})
export class TutorApiService {
    private readonly tutoresUrl = 'http://localhost:8080/api/tutores';
    private readonly pacientesUrl = 'http://localhost:8080/api/pacientes';
    private readonly instructoresUrl = 'http://localhost:8080/api/instructores';
    private readonly apiUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken_tutor');
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

    getTutorPorUsuario(idUsuario: number): Observable<TutorDto> {
        return this.http.get<TutorDto>(`${this.tutoresUrl}/usuario/${idUsuario}`, { headers: this.getAuthHeaders() });
    }

    getPacientesPorTutor(idTutor: number): Observable<PacienteDto[]> {
        return this.http.get<PacienteDto[]>(`${this.pacientesUrl}/tutor/${idTutor}`, { headers: this.getAuthHeaders() });
    }

    /*ENDPOINT DONDE MUESTRAS LAS CARDS DE RESERVA DEL TUTOR*/
    getSesionesTutor(idTutor: number): Observable<ReservaTutorSesionDto[]> {
        return this.http.get<ReservaTutorSesionDto[]>(`${this.apiUrl}/reservas/tutor/${idTutor}`, { headers: this.getAuthHeaders() });
    }

    buscarInstructoresCatalogo(filtros?: {
        texto?: string; distrito?: string; especialidad?: string;
        tarifaMin?: number | null; tarifaMax?: number | null; turno?: string;
    }): Observable<InstructorCatalogoDto[]> {
        let params = new HttpParams();
        if (filtros?.texto?.trim()) params = params.set('texto', filtros.texto.trim());
        if (filtros?.distrito?.trim()) params = params.set('distrito', filtros.distrito.trim());
        if (filtros?.especialidad?.trim()) params = params.set('especialidad', filtros.especialidad.trim());
        if (filtros?.tarifaMin != null) params = params.set('tarifaMin', String(filtros.tarifaMin));
        if (filtros?.tarifaMax != null) params = params.set('tarifaMax', String(filtros.tarifaMax));
        if (filtros?.turno?.trim()) params = params.set('turno', filtros.turno.trim());
        return this.http.get<InstructorCatalogoDto[]>(`${this.instructoresUrl}/busqueda`, { headers: this.getAuthHeaders(), params });
    }

    getPerfilInstructorResumen(idInstructor: number): Observable<InstructorPerfilResumenDto> {
        return this.http.get<InstructorPerfilResumenDto>(`${this.instructoresUrl}/${idInstructor}/perfil/resumen`, { headers: this.getAuthHeaders() });
    }

    getPerfilInstructorSedes(idInstructor: number): Observable<InstructorPerfilSedeDto[]> {
        return this.http.get<InstructorPerfilSedeDto[]>(`${this.instructoresUrl}/${idInstructor}/perfil/sedes`, { headers: this.getAuthHeaders() });
    }

    getPerfilInstructorServicios(idInstructor: number): Observable<InstructorPerfilServicioDto[]> {
        return this.http.get<InstructorPerfilServicioDto[]>(`${this.instructoresUrl}/${idInstructor}/perfil/servicios`, { headers: this.getAuthHeaders() });
    }

    getPerfilInstructorCalificaciones(idInstructor: number): Observable<InstructorPerfilCalificacionDto[]> {
        return this.http.get<InstructorPerfilCalificacionDto[]>(`${this.instructoresUrl}/${idInstructor}/perfil/calificaciones`, { headers: this.getAuthHeaders() });
    }

    crearReserva(request: ReservaRequestDto): Observable<ReservaResponseDto> {
        return this.http.post<ReservaResponseDto>(`${this.apiUrl}/reservas`, request, { headers: this.getAuthHeaders() });
    }

    validarReserva(request: ReservaRequestDto): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/reservas/validar`, request, { headers: this.getAuthHeaders() });
    }
}