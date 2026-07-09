import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { PanelHeaderComponent } from '../../shared/components/header/panel-header/panel-header.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, PanelHeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
})
export class Admin {
  isSidebarOpen = false;

  constructor(
    private router: Router,
    private authApiService: AuthApiService
  ) { }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebarOnMobile(): void {
    if (this.isSidebarOpen) {
      this.isSidebarOpen = false;
    }
  }

  logout(): void {
    const sesion = this.authApiService.getSesionActiva();

    if (sesion) {
      this.authApiService.logout(sesion.rol);
    }

    this.router.navigate(['/']);
  }
}
