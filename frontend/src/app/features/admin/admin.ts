import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';
import { MonitoreoService } from './services/monitoreo.service';
import { SolicitudesService } from './services/solicitudes.service';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { PanelHeaderComponent } from '../../shared/components/header/panel-header/panel-header.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, PanelHeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
})
export class Admin implements OnInit {
  isSidebarOpen = false;
  counts: Record<string, number> = {
    solicitudes: 0,
    instructores: 0,
    pacientes: 0,
  };

  constructor(
    private router: Router,
    private authApiService: AuthApiService,
    private solicitudesService: SolicitudesService,
    private monitoreoService: MonitoreoService
  ) { }

  ngOnInit(): void {
    this.cargarConteosDesdeServicios();
  }

  private cargarConteosDesdeServicios(): void {
    this.solicitudesService.obtenerTodo().subscribe({
      next: (response: { solicitudes?: Array<unknown> }) => {
        this.updateCount('solicitudes', response?.solicitudes?.length || 0);
      },
      error: (err: unknown) => console.error('Error al cargar conteo de solicitudes:', err),
    });

    this.monitoreoService.obtenerInstructores().subscribe({
      next: (data: Array<unknown>) => {
        this.updateCount('instructores', data?.length || 0);
      },
      error: (err: unknown) => console.error('Error al cargar conteo de instructores:', err),
    });

    this.monitoreoService.obtenerPacientes().subscribe({
      next: (data: Array<unknown>) => {
        this.updateCount('pacientes', data?.length || 0);
      },
      error: (err: unknown) => console.error('Error al cargar conteo de pacientes:', err),
    });
  }

  private syncCountsFromCurrentPage(): void {
    this.counts = { ...this.counts };
  }

  private updateCount(key: string, value: number): void {
    this.counts = { ...this.counts, [key]: value };
  }

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
