import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InstructorMonitoreo } from '../models/instructor-monitoreo.model';

@Injectable({ providedIn: 'root' })
export class FiltroInstructorService {
    private readonly baseUrl = 'http://localhost:8080/api/admin/filtro';

    constructor(private http: HttpClient) { }

    buscarPorNombre(nombre: string): Observable<InstructorMonitoreo[]> {
        return this.http.get<InstructorMonitoreo[]>(`${this.baseUrl}/instructor/buscar?nombre=${encodeURIComponent(nombre)}`);
    }
}