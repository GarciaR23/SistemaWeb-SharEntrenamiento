import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthApiService } from '../services/auth-api.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthApiService);

    const bypassHeader = req.headers.get('X-Skip-Error-Interceptor');
    const shouldBypass = bypassHeader === 'true';

    return next(req).pipe(
        catchError((error) => {
            if (shouldBypass) {
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
                default:
                    router.navigate(['/error/500']);
                    break;
            }
            return throwError(() => error);
        })
    );
};

