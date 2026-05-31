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
  usuario: UsuarioAuth | null;
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

  register(email: string, clave: string, rol: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/register`, { email, clave, rol });
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
    const userJson = localStorage.getItem('authUser');
    return userJson ? JSON.parse(userJson) : null;
  }
}
