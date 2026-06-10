import { Injectable } from '@angular/core';
import { DepartmentMap, Ubigeo } from '../../shared/interfaces/ubigeo';
import { map, Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Ubication {
  district: string;
  code: string;
}

@Injectable({
  providedIn: 'root',
})
export class Location {
  private apiUrl = 'https://free.e-api.net.pe/ubigeos.json';
  private cache$?: Observable<Ubication[]>;

  constructor(private http: HttpClient) {
  }

  getDistricts(): Observable<Ubication[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<DepartmentMap>(this.apiUrl).pipe(
        map((data) => {
          const list: Ubication[] = [];
          Object.values(data).forEach(provinces => {
            Object.values(provinces).forEach(districts => {
              Object.entries(districts).forEach(([distName, info]) => {
                const inf = info as Ubigeo;
                list.push({
                  district: distName,
                  code: inf.ubigeo
                });
              });
            });
          });
          return list;
        }),
        shareReplay(1)
      );
    }
    return this.cache$;
  }

  getDistrictsByUbigeoPrefix(prefix: string): Observable<Ubication[]> {
    return this.getDistricts().pipe(
      map(list => list.filter(item => item.code.startsWith(prefix)))
    );
  }
}