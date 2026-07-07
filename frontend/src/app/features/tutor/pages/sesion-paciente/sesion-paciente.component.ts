import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {
    ReservaTutorSesionDto,
    TutorApiService
} from '../../services/tutor-api.service';

import { PacienteDto } from '../../models/paciente.model';

@Component({
    selector: 'app-sesion-paciente',
    imports: [CommonModule],
    templateUrl: './sesion-paciente.component.html',
    styleUrls: ['./sesion-paciente.component.scss']
})
export class Sesion implements OnInit {
    sesiones: ReservaTutorSesionDto[] = [];
    pacientes: PacienteDto[] = [];

    cargando = true;
    errorMessage = '';
    mostrarModalReserva = false;
    mostrarModalDetalle = false;
    sesionDetalle: ReservaTutorSesionDto | null = null;

    idTutor: number | null = null;
    idPacienteSeleccionado: number | null = null;

    constructor(
        private tutorApiService: TutorApiService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.mostrarModalReserva = this.route.snapshot.queryParamMap.get('reservaCreada') === 'true';

        const idPacienteUrl = Number(this.route.snapshot.queryParamMap.get('idPaciente'));

        if (idPacienteUrl) {
            this.idPacienteSeleccionado = idPacienteUrl;
        }

        this.cargarPacienteYSesiones();
    }

    cargarPacienteYSesiones(): void {
        this.cargando = true;
        this.errorMessage = '';

        this.idTutor = this.obtenerIdTutorSesion();

        if (!this.idTutor) {
            this.errorMessage = 'No se pudo identificar al tutor autenticado.';
            this.cargando = false;
            return;
        }

        this.tutorApiService.getPacientesPorTutor(this.idTutor).subscribe({
            next: (pacientes) => {
                this.pacientes = pacientes || [];

                if (this.pacientes.length === 0) {
                    this.errorMessage = 'No tienes pacientes registrados.';
                    this.cargando = false;
                    return;
                }

                if (!this.idPacienteSeleccionado) {
                    this.idPacienteSeleccionado = this.pacientes[0].idPaciente;
                }

                this.cargarSesionesTutorFiltradas();
            },
            error: (err) => {
                console.error('Error al obtener pacientes:', err);
                this.errorMessage = 'No se pudo cargar el paciente del tutor.';
                this.cargando = false;
            }
        });
    }

    cargarSesionesTutorFiltradas(): void {
        if (!this.idTutor || !this.idPacienteSeleccionado) {
            this.errorMessage = 'No se pudo identificar el paciente seleccionado.';
            this.cargando = false;
            return;
        }

        this.tutorApiService.getSesionesTutor(this.idTutor).subscribe({
            next: (response) => {
                const sesionesTutor = response || [];

                this.sesiones = sesionesTutor
                    .filter(sesion => sesion.idPaciente === this.idPacienteSeleccionado)
                    .sort((a, b) => {
                        return new Date(b.seleccionHorario).getTime() - new Date(a.seleccionHorario).getTime();
                    });

                this.cargando = false;
            },
            error: (err) => {
                console.error('Error al cargar sesiones:', err);
                this.errorMessage = 'No se pudieron cargar las sesiones del paciente.';
                this.cargando = false;
            }
        });
    }

    obtenerIdTutorSesion(): number | null {
        const authUserTutor = localStorage.getItem('authUser_tutor');
        const authUser = localStorage.getItem('authUser');

        const raw = authUserTutor || authUser;

        if (!raw) {
            return null;
        }

        try {
            const user = JSON.parse(raw);

            const idTutor = Number(
                user.idTutor ||
                user.tutor?.idTutor ||
                user.id_tutor
            );

            return idTutor || null;
        } catch {
            return null;
        }
    }

    cerrarModalReserva(): void {
        this.mostrarModalReserva = false;

        this.router.navigate(['/tutor/sesion'], {
            queryParams: {
                idPaciente: this.idPacienteSeleccionado
            },
            replaceUrl: true
        });
    }

    esSesionEnCurso(sesion: ReservaTutorSesionDto): boolean {
        return this.obtenerEstadoTexto(sesion) === 'EN CURSO';
    }

    obtenerSesionEnCurso(): ReservaTutorSesionDto | null {
        return this.sesiones.find(sesion => this.esSesionEnCurso(sesion)) || null;
    }

    obtenerSesionesNoEnCurso(): ReservaTutorSesionDto[] {
        return this.sesiones.filter(sesion => !this.esSesionEnCurso(sesion));
    }

    obtenerSesionPrincipal(): ReservaTutorSesionDto | null {
        return this.obtenerSesionEnCurso();
    }

    obtenerSesionesSecundarias(): ReservaTutorSesionDto[] {
        return this.obtenerSesionesNoEnCurso();
    }

    obtenerImagenSesion(sesion: ReservaTutorSesionDto): string {
        return sesion.instructorImagen || sesion.pacienteImagen || 'https://via.placeholder.com/300x300?text=Instructor';
    }

    obtenerNombreInstructor(sesion: ReservaTutorSesionDto): string {
        return sesion.instructorNombre || `Instructor #${sesion.idInstructor}`;
    }

    obtenerEstadoTexto(sesion: ReservaTutorSesionDto): string {
        const estadoReserva = this.normalizarTexto(sesion.estadoReserva || '');

        if (estadoReserva === 'pendiente') {
            return 'PENDIENTE';
        }

        if (estadoReserva === 'rechazada') {
            return 'RECHAZADA';
        }

        if (estadoReserva === 'aprobada') {
            const inicio = new Date(sesion.seleccionHorario).getTime();
            const ahora = new Date().getTime();
            const fin = inicio + sesion.duracionMinutos * 60000;

            if (ahora < inicio) {
                return 'PROGRAMADA';
            }

            if (ahora >= inicio && ahora <= fin) {
                return 'EN CURSO';
            }

            return 'FINALIZADA';
        }

        return estadoReserva.toUpperCase() || 'SIN ESTADO';
    }

    obtenerFecha(sesion: ReservaTutorSesionDto): string {
        const fecha = new Date(sesion.seleccionHorario);

        return fecha.toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short'
        });
    }

    obtenerHora(sesion: ReservaTutorSesionDto): string {
        const fecha = new Date(sesion.seleccionHorario);

        return fecha.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    obtenerDuracionTexto(sesion: ReservaTutorSesionDto): string {
        return `${sesion.duracionMinutos} min`;
    }

    obtenerTiempoEstado(sesion: ReservaTutorSesionDto): string {
        const estadoReserva = this.normalizarTexto(sesion.estadoReserva || '');

        if (estadoReserva === 'pendiente') {
            return 'Esperando aprobación';
        }

        if (estadoReserva === 'rechazada') {
            return 'Reserva rechazada';
        }

        const inicio = new Date(sesion.seleccionHorario).getTime();
        const ahora = new Date().getTime();
        const fin = inicio + sesion.duracionMinutos * 60000;

        if (ahora < inicio) {
            return 'Programada';
        }

        if (ahora > fin) {
            return 'Finalizada';
        }

        const restantes = Math.ceil((fin - ahora) / 60000);
        return `${restantes} min restantes`;
    }

    obtenerTotalHoy(): number {
        const hoy = new Date();

        return this.sesiones.filter(sesion => {
            const fechaSesion = new Date(sesion.seleccionHorario);

            return (
                fechaSesion.getFullYear() === hoy.getFullYear() &&
                fechaSesion.getMonth() === hoy.getMonth() &&
                fechaSesion.getDate() === hoy.getDate()
            );
        }).length;
    }

    irCatalogo(): void {
        this.router.navigate(['/tutor/catalogo-instructor']);
    }

    verDetalles(sesion: ReservaTutorSesionDto): void {
        this.sesionDetalle = sesion;
        this.mostrarModalDetalle = true;
    }

    abrirDetalle(sesion: ReservaTutorSesionDto): void {
        this.sesionDetalle = sesion;
        this.mostrarModalDetalle = true;
    }

    cerrarDetalle(): void {
        this.mostrarModalDetalle = false;
        this.sesionDetalle = null;
    }

    verHojaRuta(sesion: ReservaTutorSesionDto): void {
        console.log('Hoja de ruta:', sesion.idReserva);
    }

    reportarIncidente(sesion: ReservaTutorSesionDto): void {
        console.log('Incidente:', sesion.idReserva);
    }

    pagar(sesion: ReservaTutorSesionDto): void {
        console.log('Pagar:', sesion.idReserva);
    }

    normalizarTexto(texto: string): string {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    obtenerClaseEstado(sesion: ReservaTutorSesionDto): string {
        const estado = this.obtenerEstadoTexto(sesion);

        if (estado === 'PENDIENTE') {
            return 'status-pending';
        }

        if (estado === 'RECHAZADA') {
            return 'status-rejected';
        }

        if (estado === 'EN CURSO') {
            return 'status-progress';
        }

        if (estado === 'FINALIZADA') {
            return 'status-finished';
        }

        return 'status-programmed';
    }

    obtenerMonto(sesion: ReservaTutorSesionDto): string {
        return `S/ ${Number(sesion.montoTotal || 0).toFixed(2)}`;
    }

    obtenerSede(sesion: ReservaTutorSesionDto): string {
        return sesion.nombreSede || 'Sede no registrada';
    }

    obtenerDireccionSede(sesion: ReservaTutorSesionDto): string {
        return sesion.direccionSede || 'Dirección no registrada';
    }

    puedePagar(sesion: ReservaTutorSesionDto): boolean {
        return this.normalizarTexto(sesion.estadoReserva || '') === 'aprobada';
    }
}