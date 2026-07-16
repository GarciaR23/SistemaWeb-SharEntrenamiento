import { Component, Input, Output, EventEmitter, HostListener, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { Notificacion } from '../../../../features/notificacion/models/notificacion.model';
import { NotificacionService } from '../../../../features/notificacion/services/notificacion.service';

@Component({
    selector: 'app-panel-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './panel-header.component.html',
    styleUrls: ['./panel-header.component.scss']
})
export class PanelHeaderComponent implements OnInit {
    @Input() modo: 'admin' | 'instructor' | 'tutor' = 'admin';
    @Output() logoutClick = new EventEmitter<void>();
    @Output() menuToggle = new EventEmitter<void>();

    showDropdown = false;
    showNotificaciones = false;
    notificacionesCargadas = false;
    fotoPerfil: string = 'assets/icons/default-avatar.png';

    notificaciones: Notificacion[] = [];
    notificacionesVistas: Set<number> = new Set();
    totalNotificaciones: number = 0;

    constructor(
        private elementRef: ElementRef,
        private http: HttpClient,
        private notificacionService: NotificacionService,
        private router: Router
    ) {
        // Cerrar dropdown al navegar
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.showNotificaciones = false;
                this.showDropdown = false;
            });
    }

    ngOnInit(): void {
        this.cargarFotoPerfil();
        this.cargarNotificaciones();
    }

    cargarFotoPerfil(): void {
        const userJson = localStorage.getItem(`authUser_${this.modo}`);
        if (!userJson) return;

        const user = JSON.parse(userJson);

        switch (this.modo) {
            case 'instructor':
                if (user.idInstructor) {
                    this.http.get<any>(`http://localhost:8080/api/instructores/${user.idInstructor}`)
                        .subscribe({
                            next: (data) => this.fotoPerfil = data.urlImagenPerfil || 'assets/icons/default-avatar.png',
                            error: () => this.fotoPerfil = 'assets/icons/default-avatar.png'
                        });
                }
                break;
            case 'tutor':
                if (user.idPaciente) {
                    this.http.get<any>(`http://localhost:8080/api/pacientes/${user.idPaciente}`)
                        .subscribe({
                            next: (data) => this.fotoPerfil = data.urlImagenPaciente || 'assets/icons/default-avatar.png',
                            error: () => this.fotoPerfil = 'assets/icons/default-avatar.png'
                        });
                }
                break;
            default:
                this.fotoPerfil = 'assets/icons/admin-avatar.png';
        }
    }

    cargarNotificaciones(): void {
        const userJson = localStorage.getItem(`authUser_${this.modo}`);
        if (!userJson) return;
        const user = JSON.parse(userJson);

        switch (this.modo) {
            case 'admin':
                this.notificacionService.obtenerNotificacionesAdmin().subscribe({
                    next: (data) => {
                        this.notificaciones = data.notificaciones || [];
                        this.actualizarContador();
                    }
                });
                break;
            case 'instructor':
                if (user.idInstructor) {
                    this.notificacionService.obtenerNotificacionesInstructor(user.idInstructor).subscribe({
                        next: (data) => {
                            this.notificaciones = data.notificaciones || [];
                            this.actualizarContador();
                        }
                    });
                }
                break;
            case 'tutor':
                if (user.idPaciente) {
                    this.notificacionService.obtenerNotificacionesPaciente(user.idPaciente).subscribe({
                        next: (data) => {
                            this.notificaciones = data.notificaciones || [];
                            this.actualizarContador();
                        }
                    });
                }
                break;
        }
    }

    actualizarContador(): void {
        this.totalNotificaciones = this.notificaciones.filter(
            n => !this.notificacionesVistas.has(n.idReferencia)
        ).length;
    }

    toggleDropdown(event: Event): void {
        event.stopPropagation();
        this.showDropdown = !this.showDropdown;
        this.showNotificaciones = false;
    }

    toggleNotificaciones(event: Event): void {
        event.stopPropagation();
        this.showNotificaciones = !this.showNotificaciones;
        this.showDropdown = false;
        if (this.showNotificaciones && !this.notificacionesCargadas) {
            this.cargarNotificaciones();
            this.notificacionesCargadas = true;
        }
    }

    emitLogout(): void {
        this.showDropdown = false;
        this.logoutClick.emit();
    }

    irANotificacion(notif: Notificacion): void {
        this.notificacionesVistas.add(notif.idReferencia);
        this.actualizarContador();
        this.showNotificaciones = false;

        switch (notif.tipo) {
            case 'solicitud':
                this.router.navigate(['/admin/solicitud-instructor']);
                break;
            case 'observacion':
                this.router.navigate(['/admin/observacion-reclamo']);
                break;
            case 'nueva_solicitud':
                this.router.navigate(['/instructor/revision']);
                break;
            case 'hoja_ruta_pendiente':
                this.router.navigate(['/instructor/hoja-ruta']);
                break;
            case 'sesion_proxima':
            case 'sesion_programada':
                this.router.navigate(['/instructor/sesion']);
                break;
            case 'recordatorio_sesion':
                this.router.navigate(['/tutor/reserva']);
                break;
            case 'sesion_aprobada':
            case 'reserva_cancelada':
            case 'plazo_vencido':
            case 'plan_ejercicios':
                this.router.navigate(['/tutor/reserva']);
                break;
            case 'pago_recibido':
                this.router.navigate(['/instructor/pagos']);
                break;
            default:
                break;
        }
    }

    isNotificacionVista(id: number): boolean {
        return this.notificacionesVistas.has(id);
    }

    getIconoSVG(tipo: string): string {
        switch (tipo) {
            case 'solicitud':
            case 'nueva_solicitud':
                return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`;
            case 'hoja_ruta_pendiente':
            case 'plan_ejercicios':
                return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
            case 'sesion_proxima':
            case 'sesion_programada':
            case 'recordatorio_sesion':
                return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
            case 'sesion_aprobada':
                return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
            case 'reserva_cancelada':
                return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
            case 'plazo_vencido':
                return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
            case 'pago_recibido':
                return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
            case 'observacion':
                return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
            default:
                return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
        }
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.showDropdown = false;
            this.showNotificaciones = false;
            this.notificacionesCargadas = false;
        }
    }
}