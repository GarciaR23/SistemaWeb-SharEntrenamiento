
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {

    constructor(
        private router: Router,
        private authService: AuthApiService
    ) { }

    volverAlInicio(): void {
        const sesion = this.authService.getSesionActiva();
        if (sesion) {
            this.router.navigate([`/${sesion.rol}/inicio`]);
        } else {
            this.router.navigate(['/']);
        }
    }
}