import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthApiService } from '../../core/services/auth-api.service';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { PanelHeaderComponent } from '../../shared/components/header/panel-header/panel-header.component';

@Component({
    selector: 'app-tutor',
    imports: [PanelHeaderComponent, SidebarComponent, RouterOutlet],
    templateUrl: './tutor.html',
    styleUrls: ['./tutor.scss']
})
export class Tutor implements AfterViewInit {
    mobileOpen = false;
    counts: Record<string, number> = {
        instructor: 0,
        reserva: 0,
        plan: 0,
        actividad: 0,
        progreso: 0,
    };

    @ViewChild(RouterOutlet) routerOutlet?: RouterOutlet;

    constructor(
        private router: Router,
        private authApiService: AuthApiService
    ) { }

    ngAfterViewInit(): void {
        this.syncCountsFromCurrentPage();
        setTimeout(() => this.syncCountsFromCurrentPage(0), 0);

        this.router.events
            .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
            .subscribe(() => setTimeout(() => this.syncCountsFromCurrentPage(0), 0));
    }

    private syncCountsFromCurrentPage(retryCount = 0): void {
        const component = this.routerOutlet?.component as Record<string, unknown> | undefined;
        if (!component) {
            return;
        }

        const nextCounts: Record<string, number> = { ...this.counts };

        if (Object.prototype.hasOwnProperty.call(component, 'instructores')) {
            nextCounts['instructor'] = this.getArrayLength(component, 'instructores');
        } else {
            nextCounts['instructor'] = 0;
        }

        if (Object.prototype.hasOwnProperty.call(component, 'sesiones')) {
            nextCounts['reserva'] = this.getArrayLength(component, 'sesiones');
        } else {
            nextCounts['reserva'] = 0;
        }

        if (Object.prototype.hasOwnProperty.call(component, 'planes')) {
            nextCounts['plan'] = this.getArrayLength(component, 'planes');
        } else {
            nextCounts['plan'] = 0;
        }

        if (Object.prototype.hasOwnProperty.call(component, 'actividades')) {
            nextCounts['actividad'] = this.getArrayLength(component, 'actividades');
        } else {
            nextCounts['actividad'] = 0;
        }

        if (Object.prototype.hasOwnProperty.call(component, 'progresos')) {
            nextCounts['progreso'] = this.getArrayLength(component, 'progresos');
        } else {
            nextCounts['progreso'] = 0;
        }

        this.counts = nextCounts;

        const hasVisibleCounts = Object.values(this.counts).some(count => count > 0);
        if (!hasVisibleCounts && retryCount < 5) {
            setTimeout(() => this.syncCountsFromCurrentPage(retryCount + 1), 250);
        }
    }

    private getArrayLength(component: Record<string, unknown>, key: string): number {
        const value = component[key];
        return Array.isArray(value) ? value.length : 0;
    }

    logout(): void {
        const sesion = this.authApiService.getSesionActiva();
        if (sesion) {
            this.authApiService.logout(sesion.rol);
        }
        this.router.navigate(['/']);
    }

    toggleSidebar(): void {
        this.mobileOpen = !this.mobileOpen;
    }
}