import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const roles = ['admin', 'instructor', 'tutor'];
        let token: string | null = null;

        for (const rol of roles) {
            const t = localStorage.getItem(`authToken_${rol}`);
            if (t) {
                token = t;
                break;
            }
        }

        if (token) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
            return next.handle(cloned);
        }

        return next.handle(req);
    }
}