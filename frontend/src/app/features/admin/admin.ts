import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { PanelHeaderComponent } from '../../shared/components/header/panel-header/panel-header.component';

@Component({
  selector: 'app-admin',
  imports: [PanelHeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
})
export class Admin {

  constructor(
    private router: Router,
    private authApiService: AuthApiService
  ) { }

  logout(): void {
    const sesion = this.authApiService.getSesionActiva();

    if (sesion) {
      this.authApiService.logout(sesion.rol);
    }

    this.router.navigate(['/']);
  }
}
