import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { PanelHeaderComponent } from '../../shared/components/header/panel-header/panel-header.component';

@Component({
    selector: 'app-instructor',
    imports: [PanelHeaderComponent, SidebarComponent, RouterOutlet],
    templateUrl: './instructor.html',
    styleUrls: ['./instructor.scss']
})
export class Instructor {

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