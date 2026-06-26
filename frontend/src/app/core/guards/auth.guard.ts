import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthApiService } from '../services/auth-api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthApiService
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const sesion = this.authService.getSesionActiva();
        const rolRuta = route.parent?.url[0]?.path || route.url[0]?.path;

        if (!sesion) {
            this.router.navigate(['/login']);
            return false;
        }

        if (sesion.rol === 'admin') return true;

        if (rolRuta === sesion.rol) return true;

        this.router.navigate(['/error/403']);
        return false;
    }
}