import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthApiService } from '../../core/services/auth-api.service';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { PanelHeaderComponent } from '../../shared/components/header/panel-header/panel-header.component';

@Component({
    selector: 'app-instructor',
    imports: [PanelHeaderComponent, SidebarComponent, RouterOutlet],
    templateUrl: './instructor.html',
    styleUrls: ['./instructor.scss']
})
export class Instructor implements AfterViewInit {
    mobileOpen = false;
    counts: Record<string, number> = {
        revision: 0,
        rutas: 0,
        sesion: 0,
        calendario: 0,
        pagos: 0,
    };

    @ViewChild(RouterOutlet) routerOutlet?: RouterOutlet;

    constructor(
        private router: Router,
        private authApiService: AuthApiService
    ) { }

    ngAfterViewInit(): void {
        this.syncCountsFromCurrentPage();
        setTimeout(() => this.syncCountsFromCurrentPage(), 0);

        this.router.events
            .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
            .subscribe(() => setTimeout(() => this.syncCountsFromCurrentPage(), 0));
    }

    private syncCountsFromCurrentPage(): void {
        const component = this.routerOutlet?.component as Record<string, unknown> | undefined;
        if (!component) {
            return;
        }

        const nextCounts: Record<string, number> = { ...this.counts };

        if (Object.prototype.hasOwnProperty.call(component, 'solicitudes')) {
            nextCounts['revision'] = this.getArrayLength(component, 'solicitudes');
        }

        if (Object.prototype.hasOwnProperty.call(component, 'sesiones')) {
            nextCounts['rutas'] = this.getArrayLength(component, 'sesiones');
            nextCounts['sesion'] = this.getArrayLength(component, 'sesiones');
        }

        if (Object.prototype.hasOwnProperty.call(component, 'sessions')) {
            nextCounts['calendario'] = this.getArrayLength(component, 'sessions');
        }

        if (Object.prototype.hasOwnProperty.call(component, 'transacciones')) {
            nextCounts['pagos'] = this.getArrayLength(component, 'transacciones');
        }

        this.counts = nextCounts;
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