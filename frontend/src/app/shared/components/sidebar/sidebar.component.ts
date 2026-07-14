import { Component, Input, inject } from '@angular/core';

import { Router, RouterModule } from '@angular/router';

interface SidebarMenuItem {
  path: string;
  icon: string;
  label: string;
  countKey?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private readonly router = inject(Router);

  @Input() modo: 'admin' | 'instructor' | 'tutor' = 'admin';
  @Input() mobileOpen = false;
  @Input() counts: Record<string, number> = {};

  getHomeRoute(): string {
    switch (this.modo) {
      case 'admin':
        return '/admin/inicio';
      case 'instructor':
        return '/instructor/inicio';
      case 'tutor':
      default:
        return '/tutor/inicio';
    }
  }

  irInicio(): void {
    this.router.navigate([this.getHomeRoute()]);
  }

  menus: Record<'admin' | 'instructor' | 'tutor', SidebarMenuItem[]> = {
    admin: [
      { path: '/admin/inicio', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', label: 'Inicio' },
      {
        path: '/admin/solicitud-instructor',
        icon: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
        label: 'Solicitudes',
      },
      {
        path: '/admin/reporte-instructor',
        icon: 'M12 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm8 7h-4.1c-.5 0-1 .2-1.3.6L12 13l-2.6-3.4c-.3-.4-.8-.6-1.3-.6H4v2h3.5l3 4v5h3v-5l3-4H20V9z',
        label: 'Instructores',
      },
      {
        path: '/admin/reporte-paciente',
        icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
        label: 'Pacientes',
      },
      {
        path: '/admin/observacion-reclamo',
        icon: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
        label: 'Observaciones',
      },
    ],
    instructor: [
      { path: '/instructor/inicio', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', label: 'Inicio' },
      {
        path: '/instructor/sede',
        icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z',
        label: 'Sedes',
      },
      {
        path: '/instructor/revision',
        icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 14H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z',
        label: 'Revisión',
        countKey: 'revision',
      },
      {
        path: '/instructor/hoja-ruta',
        icon: 'M4 4h16v16H4V4zm2 2v12.5l5-3.5 5 3.5V6H6zm5 2h4v2h-4V8zm0 5h4v2h-4v-2z',
        label: 'Rutas',
        countKey: 'rutas',
      },
      {
        path: '/instructor/sesion',
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
        label: 'Sesión',
        countKey: 'sesion',
      },
      {
        path: '/instructor/calendario',
        icon: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z',
        label: 'Calendario',
        countKey: 'calendario',
      },
      {
        path: '/instructor/pago',
        icon: 'M21 7H3V5h18v2zm0 2H3v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9zm-4 7h-4v-2h4v2z',
        label: 'Pagos',
        countKey: 'pagos',
      },
    ],
    tutor: [
      {
        path: '/tutor/inicio',
        icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
        label: 'Inicio',
      },
      {
        path: '/tutor/catalogo-instructor',
        icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
        label: 'Instructores',
        countKey: 'instructor',
      },
      {
        path: '/tutor/reserva',
        icon: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15H5V9h14v10z',
        label: 'Reserva',
        countKey: 'reserva',
      },
      {
        path: '/tutor/plan',
        icon: 'M19 3H14.82C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-1c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 15H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
        label: 'Plan',
        countKey: 'plan',
      },
      {
        path: '/tutor/actividad',
        icon: 'M2 9h2v6H2V9zm3-2h2v10H5V7zm3 3h8v4H8v-4zm9-3h2v10h-2V7zm3 2h2v6h-2V9z',
        label: 'Actividad',
        countKey: 'actividad',
      },
      {
        path: '/tutor/progreso',
        icon: 'M3 17h2v-7H3v7zm4 0h2V7H7v10zm4 0h2v-4h-2v4zm4 0h2V4h-2v13zm4 0h2V10h-2v7z',
        label: 'Progreso',
        countKey: 'progreso',
      },
    ],
  };
  get currentMenu() {
    return this.menus[this.modo] || [];
  }
}
