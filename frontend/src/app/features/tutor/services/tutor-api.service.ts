import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PacienteDto } from '../models/paciente.model';

export interface TutorDto {
    idTutor: number;
    idUsuario: number;
    nombreCompleto: string;
}

export interface InstructorCatalogoDto {
    idInstructor: number;
    nombreCompleto: string;
    urlImagenPerfil: string | null;
    especialidad: string | null;
    biografia: string | null;
    distrito: string | null;
    direccion: string | null;

    idSede: number | null;
    direccionSede: string | null;
    distritoSede: string | null;

    tarifaHora: number | null;
    horarioPreferencia: string | null;
    diaDisponible: string | null;
    horarioInicio: string | null;
    horarioFinal: string | null;

    promedioCalificacion: number | null;
    totalSesiones: number | null;

}
export interface InstructorPerfilResumenDto {
    idInstructor: number;
    nombreCompleto: string;
    urlImagenPerfil: string | null;
    especialidad: string | null;
    biografia: string | null;
    direccion: string | null;
    distrito: string | null;
}

export interface InstructorPerfilSedeDto {
    idSede: number;
    urlImagenSede1: string | null;
    urlImagenSede2: string | null;
    urlImagenSede3: string | null;
    descripcionSede: string | null;
    direccionSede: string | null;
    distritoSede: string | null;
    estadoActivacion: boolean | null;
}

export interface InstructorPerfilServicioDto {
    idServicio: number;
    tarifaHora: number | null;
    horarioPreferencia: string | null;
    diaDisponible: string | null;
    horarioInicio: string | null;
    horarioFinal: string | null;
}

export interface InstructorPerfilCalificacionDto {
    idCalificacion: number;
    idPaciente: number;
    pacienteNombre: string;
    puntajeEstrellas: number | null;
    comentarioCliente: string | null;
    fechaCalificacion: string | null;
}

@Injectable({
    providedIn: 'root',
})
export class TutorApiService {
    private readonly tutoresUrl = 'http://localhost:8080/api/tutores';
    private readonly pacientesUrl = 'http://localhost:8080/api/pacientes';
    private readonly instructoresUrl = 'http://localhost:8080/api/instructores';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken_tutor');

        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
    }

    getTutorPorUsuario(idUsuario: number): Observable<TutorDto> {
        return this.http.get<TutorDto>(
            `${this.tutoresUrl}/usuario/${idUsuario}`,
            {
                headers: this.getAuthHeaders(),
            }
        );
    }

    getPacientesPorTutor(idTutor: number): Observable<PacienteDto[]> {
        return this.http.get<PacienteDto[]>(
            `${this.pacientesUrl}/tutor/${idTutor}`,
            {
                headers: this.getAuthHeaders(),
            }
        );
    }

    buscarInstructoresCatalogo(filtros?: {
        texto?: string;
        distrito?: string;
        especialidad?: string;
        tarifaMin?: number | null;
        tarifaMax?: number | null;
        turno?: string;
    }): Observable<InstructorCatalogoDto[]> {
        let params = new HttpParams();

        if (filtros?.texto && filtros.texto.trim() !== '') {
            params = params.set('texto', filtros.texto.trim());
        }

        if (filtros?.distrito && filtros.distrito.trim() !== '') {
            params = params.set('distrito', filtros.distrito.trim());
        }

        if (filtros?.especialidad && filtros.especialidad.trim() !== '') {
            params = params.set('especialidad', filtros.especialidad.trim());
        }

        if (filtros?.tarifaMin !== null && filtros?.tarifaMin !== undefined) {
            params = params.set('tarifaMin', String(filtros.tarifaMin));
        }

        if (filtros?.tarifaMax !== null && filtros?.tarifaMax !== undefined) {
            params = params.set('tarifaMax', String(filtros.tarifaMax));
        }

        if (filtros?.turno && filtros.turno.trim() !== '') {
            params = params.set('turno', filtros.turno.trim());
        }

        return this.http.get<InstructorCatalogoDto[]>(
            `${this.instructoresUrl}/busqueda`,
            {
                headers: this.getAuthHeaders(),
                params,
            }
        );

    }
    getPerfilInstructorResumen(idInstructor: number): Observable<InstructorPerfilResumenDto> {
        return this.http.get<InstructorPerfilResumenDto>(
            `${this.instructoresUrl}/${idInstructor}/perfil/resumen`,
            {
                headers: this.getAuthHeaders(),
            }
        );
    }

    getPerfilInstructorSedes(idInstructor: number): Observable<InstructorPerfilSedeDto[]> {
        return this.http.get<InstructorPerfilSedeDto[]>(
            `${this.instructoresUrl}/${idInstructor}/perfil/sedes`,
            {
                headers: this.getAuthHeaders(),
            }
        );
    }

    getPerfilInstructorServicios(idInstructor: number): Observable<InstructorPerfilServicioDto[]> {
        return this.http.get<InstructorPerfilServicioDto[]>(
            `${this.instructoresUrl}/${idInstructor}/perfil/servicios`,
            {
                headers: this.getAuthHeaders(),
            }
        );
    }

    getPerfilInstructorCalificaciones(idInstructor: number): Observable<InstructorPerfilCalificacionDto[]> {
        return this.http.get<InstructorPerfilCalificacionDto[]>(
            `${this.instructoresUrl}/${idInstructor}/perfil/calificaciones`,
            {
                headers: this.getAuthHeaders(),
            }
        );
    }
}