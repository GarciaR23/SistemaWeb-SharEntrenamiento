import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstadisticaDashboard } from '../models/estadistica-dashboard.model';
import { EvolucionDiaria } from '../models/evolucion-diaria.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private readonly baseUrl = 'http://localhost:8080/api/instructores/analitica';

    constructor(private http: HttpClient) { }

    obtenerEstadisticas(idInstructor: number): Observable<EstadisticaDashboard> {
        return forkJoin({
            sesiones: this.http.get<any>(`${this.baseUrl}/sesiones-finalizadas`),
            pacientes: this.http.get<any>(`${this.baseUrl}/pacientes-activos`),
            calificacion: this.http.get<any>(`${this.baseUrl}/calificacion-promedio`)
        }).pipe(
            map(({ sesiones, pacientes, calificacion }) => ({
                sesionesRealizadas: sesiones.totalSesionesActual || 0,
                porcentajeSesiones: sesiones.porcentajeVariacion || 0,
                pacientesActivos: pacientes.totalActivosActual || 0,
                porcentajePacientes: pacientes.porcentajeVariacion || 0,
                calificacion: calificacion.promedioEstrellas || 0,
                totalValoraciones: calificacion.totalCalificaciones || 0
            }))
        );
    }

    obtenerEvolucion(idInstructor: number): Observable<EvolucionDiaria[]> {
        return this.http.get<EvolucionDiaria[]>(`${this.baseUrl}/grafico-sesiones/${idInstructor}`);
    }
}