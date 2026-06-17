import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioAuth {
  idUsuario: number;
  email: string;
  rol: 'admin' | 'tutor' | 'instructor';
  estadoCuenta: 'pendiente_validacion' | 'activo' | 'suspendido';
  fechaRegistro: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  usuario: UsuarioAuth | null;
  idInstructor: number | null;
}

export interface ApiMessage {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(email: string, clave: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, clave });
  }

  forgotPassword(email: string): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.baseUrl}/password/forgot`, { email });
  }

  verifyRecoveryToken(email: string, token: string): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.baseUrl}/password/verify-token`, { email, token });
  }

  resetPassword(email: string, token: string, nuevaClave: string): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.baseUrl}/password/reset`, { email, token, nuevaClave });
  }

  getUsuarioLogueado(): UsuarioAuth | null {
    const sesion = this.getSesionActiva();
    return sesion ? sesion.usuario : null;
  }

  getUsuarioLogueadoPorRol(rol: string): UsuarioAuth | null {
    const userJson = localStorage.getItem(`authUser_${rol}`);
    return userJson ? JSON.parse(userJson) : null;
  }

  getToken(rol: string): string | null {
    return localStorage.getItem(`authToken_${rol}`);
  }

  getSesionActiva(): { rol: string; usuario: UsuarioAuth } | null {
    const roles = ['admin', 'tutor', 'instructor'];
    for (const rol of roles) {
      const token = localStorage.getItem(`authToken_${rol}`);
      const userJson = localStorage.getItem(`authUser_${rol}`);
      if (token && userJson) {
        return { rol, usuario: JSON.parse(userJson) };
      }
    }
    return null;
  }

  logout(rol: string): void {
    localStorage.removeItem(`authToken_${rol}`);
    localStorage.removeItem(`authUser_${rol}`);
  }
}