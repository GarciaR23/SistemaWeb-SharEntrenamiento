import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthApiService } from '../services/auth-api.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthApiService);

    return next(req).pipe(
        catchError((error) => {
            if (error.status === 400) {
                return throwError(() => error);
            }

            switch (error.status) {
                case 0:
                    router.navigate(['/error/connection']);
                    break;
                case 401: {
                    const sesion = authService.getSesionActiva();
                    if (sesion) {
                        authService.logout(sesion.rol);
                    }
                    break;
                }
                case 403:
                    router.navigate(['/error/403']);
                    break;
                case 404:
                    router.navigate(['/error/404']);
                    break;
                case 500:
                    break;
                default:
                    break;
            }
            return throwError(() => error);
        })
    );
};