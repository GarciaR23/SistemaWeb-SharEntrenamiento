import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InstructorExplorarDto } from '../models/instructor-explorar.model';

@Injectable({
    providedIn: 'root',
})
export class ExplorarInstructorApiService {
    private readonly explorarUrl = 'http://localhost:8080/api/tutores/explorar';

    constructor(private http: HttpClient) { }

    getInstructoresExplorar(): Observable<InstructorExplorarDto[]> {
        return this.http.get<InstructorExplorarDto[]>(this.explorarUrl);
    }
}