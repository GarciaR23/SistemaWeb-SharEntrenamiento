import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../layouts/header/header.component";
import { RouterOutlet } from "@angular/router";
import { AuthApiService } from '../../services/auth-api.service';

@Component({
    selector: 'app-tutor',
    imports: [HeaderComponent, RouterOutlet],
    templateUrl: './tutor.html',
})
export class Tutor {

    constructor(
        private router: Router,
        private authApiService: AuthApiService
    ) { }

    logout(): void {
        const sesion = this.authApiService.getSesionActiva();
        if (sesion) {
            localStorage.removeItem(`authToken_${sesion.rol}`);
            localStorage.removeItem(`authUser_${sesion.rol}`);
        }
        this.router.navigate(['/']);
    }
}