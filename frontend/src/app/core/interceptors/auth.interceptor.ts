import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
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
        req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
    }

    return next(req);
};