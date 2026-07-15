import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthApiService } from '../../core/services/auth-api.service';
import { TutorApiService } from './services/tutor-api.service';

import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { PanelHeaderComponent } from '../../shared/components/header/panel-header/panel-header.component';


@Component({
    selector: 'app-tutor',
    imports: [
        PanelHeaderComponent,
        SidebarComponent,
        RouterOutlet
    ],
    templateUrl: './tutor.html',
    styleUrls: ['./tutor.scss']
})
export class Tutor implements OnInit {

    mobileOpen = false;

    counts: Record<string, number> = {
        instructor: 0,
        reserva: 0,
        plan: 0,
        actividad: 0,
        progreso: 0,
    };


    constructor(
        private router: Router,
        private authApiService: AuthApiService,
        private tutorApiService: TutorApiService
    ) { }


    ngOnInit(): void {
        this.cargarConteosDesdeServicios();
    }


    private cargarConteosDesdeServicios(): void {

        const idTutor = this.obtenerIdTutorSesion();

        if (!idTutor) {
            console.error('No se pudo obtener el tutor');
            return;
        }

        // Contador de instructores
        this.tutorApiService.getPacientesPorTutor(idTutor)
            .subscribe({
                next: (data) => {

                    this.updateCount(
                        'instructor',
                        data?.length || 0
                    );

                },
                error: (err) => {
                    console.error(
                        'Error cargando instructores:',
                        err
                    );
                }
            });

        // Contador de reservas
        this.tutorApiService.getSesionesTutor(idTutor)
            .subscribe({
                next: (data) => {

                    this.updateCount(
                        'reserva',
                        data?.length || 0
                    );

                },
                error: (err) => {
                    console.error(
                        'Error cargando reservas:',
                        err
                    );
                }
            });

        // cuando tengas los endpoints se agregan aquí
        /*
        this.tutorApiService.obtenerPlanes(idTutor)
            .subscribe({
                next:(data)=>{
                    this.updateCount(
                       'plan',
                       data.length
                    );
                }
            });
        */

        /*
        this.tutorApiService.obtenerActividades(idTutor)
            .subscribe({
                next:(data)=>{
                    this.updateCount(
                       'actividad',
                       data.length
                    );
                }
            });
        */

        /*
        this.tutorApiService.obtenerProgresos(idTutor)
            .subscribe({
                next:(data)=>{
                    this.updateCount(
                       'progreso',
                       data.length
                    );
                }
            });
        */

    }

    private obtenerIdTutorSesion(): number | null {

        const raw =
            localStorage.getItem('authUser_tutor') ||
            localStorage.getItem('authUser');
        if (!raw) return null;
        try {
            const usuario = JSON.parse(raw);

            return Number(
                usuario.idTutor ||
                usuario.tutor?.idTutor ||
                usuario.id_tutor
            ) || null;
        } catch {
            return null;
        }
    }

    private updateCount(
        key: string,
        value: number
    ): void {
        this.counts = {
            ...this.counts,
            [key]: value
        };

    }

    toggleSidebar(): void {
        this.mobileOpen = !this.mobileOpen;
    }

    logout(): void {

        const sesion =
            this.authApiService.getSesionActiva();
        if (sesion) {

            this.authApiService.logout(
                sesion.rol
            );
        }

        this.router.navigate(['/']);

    }

}