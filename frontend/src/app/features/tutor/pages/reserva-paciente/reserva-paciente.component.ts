import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { TutorApiService } from '../../services/tutor-api.service';
import { PacienteDto } from '../../models/paciente.model';
import { ReservaTutorSesionDto } from '../../models/reserva-tutor-sesion.model';

@Component({
    selector: 'app-reserva-paciente',
    imports: [CommonModule],
    templateUrl: './reserva-paciente.component.html',
    styleUrls: ['./reserva-paciente.component.scss']
})
export class ReservaPaciente implements OnInit {
    sesiones: ReservaTutorSesionDto[] = [];
    pacientes: PacienteDto[] = [];
    cargando = true;
    errorMessage = '';
    mostrarModalReserva = false;
    mostrarModalDetalle = false;
    mostrarModalConfirmacionCancelacion = false;
    sesionDetalle: ReservaTutorSesionDto | null = null;
    sesionCancelacion: ReservaTutorSesionDto | null = null;
    dropdownAbierto: number | null = null;
    idTutor: number | null = null;
    idPacienteSeleccionado: number | null = null;

    constructor(private tutorApiService: TutorApiService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.mostrarModalReserva = this.route.snapshot.queryParamMap.get('reservaCreada') === 'true';
        const idPacienteUrl = Number(this.route.snapshot.queryParamMap.get('idPaciente'));
        if (idPacienteUrl) { this.idPacienteSeleccionado = idPacienteUrl; }
        this.cargarPacienteYSesiones();
    }

    cargarPacienteYSesiones(): void {
        this.cargando = true; this.errorMessage = '';
        this.idTutor = this.obtenerIdTutorSesion();
        if (!this.idTutor) { this.errorMessage = 'No se pudo identificar al tutor.'; this.cargando = false; return; }
        this.tutorApiService.getPacientesPorTutor(this.idTutor).subscribe({
            next: (pacientes) => {
                this.pacientes = pacientes || [];
                if (this.pacientes.length === 0) { this.errorMessage = 'No tienes pacientes registrados.'; this.cargando = false; return; }
                if (!this.idPacienteSeleccionado) { this.idPacienteSeleccionado = this.pacientes[0].idPaciente; }
                this.cargarSesionesTutorFiltradas();
            },
            error: () => { this.errorMessage = 'Error al cargar pacientes.'; this.cargando = false; }
        });
    }

    cargarSesionesTutorFiltradas(): void {
        if (!this.idTutor || !this.idPacienteSeleccionado) { this.errorMessage = 'Paciente no seleccionado.'; this.cargando = false; return; }
        this.tutorApiService.getSesionesTutor(this.idTutor).subscribe({
            next: (response) => {
                this.sesiones = (response || [])
                    .filter(s => s.idPaciente === this.idPacienteSeleccionado)
                    .sort((a, b) => new Date(b.horaInicioEstimada).getTime() - new Date(a.horaInicioEstimada).getTime());
                this.cargando = false;
            },
            error: () => { this.errorMessage = 'Error al cargar sesiones.'; this.cargando = false; }
        });
    }

    obtenerIdTutorSesion(): number | null {
        const raw = localStorage.getItem('authUser_tutor') || localStorage.getItem('authUser');
        if (!raw) return null;
        try { const u = JSON.parse(raw); return Number(u.idTutor || u.tutor?.idTutor || u.id_tutor) || null; }
        catch { return null; }
    }

    cerrarModalReserva(): void { this.mostrarModalReserva = false; this.router.navigate(['/tutor/reserva'], { queryParams: { idPaciente: this.idPacienteSeleccionado }, replaceUrl: true }); }
    obtenerImagenSesion(s: ReservaTutorSesionDto): string { return s.instructorImagen || s.pacienteImagen || 'https://via.placeholder.com/300x300?text=Instructor'; }
    obtenerNombreInstructor(s: ReservaTutorSesionDto): string { return s.instructorNombre || `Instructor #${s.idInstructor}`; }

    obtenerEstadoTexto(s: ReservaTutorSesionDto): string {
        const e = this.normalizarTexto(s.estadoDetalle || '');
        if (e === 'pendiente') return 'Pendiente';
        if (e === 'aprobada' || e === 'confirmada') return 'Aprobado';
        if (e === 'cancelada') return 'Cancelado';
        if (e === 'rechazada') return 'Rechazado';
        if (e === 'plazo_vencido') return 'Plazo vencido';
        return 'Pendiente';
    }

    obtenerFecha(s: ReservaTutorSesionDto): string {
        const f = new Date(s.horaInicioEstimada);
        const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return `${dias[f.getDay()]} ${f.getDate()} ${meses[f.getMonth()]}`;
    }

    obtenerHora(s: ReservaTutorSesionDto): string { return new Date(s.horaInicioEstimada).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }); }
    obtenerHoraFin(s: ReservaTutorSesionDto): string { return new Date(s.horaFinEstimada).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }); }

    obtenerDuracionTexto(s: ReservaTutorSesionDto): string {
        const h = Math.floor(s.duracionMinutos / 60); const m = s.duracionMinutos % 60;
        if (h > 0 && m > 0) return `${h}h ${m}min`;
        if (h > 0) return `${h}h`;
        return `${m}min`;
    }

    obtenerTotalHoy(): number {
        const hoy = new Date();
        return this.sesiones.filter(s => {
            const f = new Date(s.horaInicioEstimada);
            const estado = this.normalizarTexto(s.estadoDetalle || '');
            const esHoy = f.getFullYear() === hoy.getFullYear()
                && f.getMonth() === hoy.getMonth()
                && f.getDate() === hoy.getDate();
            const esActiva = estado === 'pendiente' || estado === 'aprobada';
            return esHoy && esActiva;
        }).length;
    }

    obtenerClaseBadge(s: ReservaTutorSesionDto): string {
        const e = this.normalizarTexto(s.estadoDetalle || '');
        if (e === 'pendiente') return 'badge-wait';
        if (e === 'aprobada' || e === 'confirmada') return 'badge-ready';
        if (e === 'cancelada' || e === 'rechazada' || e === 'plazo_vencido') return 'badge-declined';
        return 'badge-wait';
    }

    obtenerMonto(s: ReservaTutorSesionDto): string { return `S/ ${Number(s.montoSubtotal || 0).toFixed(2)}`; }
    obtenerSede(s: ReservaTutorSesionDto): string { return s.nombreSede || 'Sede no registrada'; }
    obtenerDireccionSede(s: ReservaTutorSesionDto): string { return s.direccionSede || 'Dirección no registrada'; }

    toggleDropdown(event: Event, id: number): void { event.stopPropagation(); this.dropdownAbierto = this.dropdownAbierto === id ? null : id; }
    cerrarDropdowns(): void { this.dropdownAbierto = null; }
    verDetalles(s: ReservaTutorSesionDto): void { this.sesionDetalle = s; this.mostrarModalDetalle = true; this.dropdownAbierto = null; }
    cerrarDetalle(): void { this.mostrarModalDetalle = false; this.sesionDetalle = null; }

    abrirConfirmacionCancelacion(s: ReservaTutorSesionDto): void {
        const ahora = new Date();
        const horaInicio = new Date(s.horaInicioEstimada);
        const horasRestantes = (horaInicio.getTime() - ahora.getTime()) / (1000 * 60 * 60);

        if (horasRestantes < 2) {
            this.errorMessage = 'No se puede cancelar con menos de 2 horas de anticipación.';
            setTimeout(() => this.errorMessage = '', 5000);
            return;
        }

        this.sesionCancelacion = s;
        this.mostrarModalConfirmacionCancelacion = true;
        this.dropdownAbierto = null;
        this.mostrarModalDetalle = false;
    }

    cerrarConfirmacionCancelacion(): void {
        this.mostrarModalConfirmacionCancelacion = false;
        this.sesionCancelacion = null;
    }

    confirmarCancelacion(): void {
        if (!this.sesionCancelacion) return;

        console.log('Cancelando detalle:', this.sesionCancelacion.idDetalle);

        this.tutorApiService.cancelarDetalle(this.sesionCancelacion.idDetalle).subscribe({
            next: (res) => {
                console.log('Cancelado exitosamente:', res);
                this.cerrarConfirmacionCancelacion();
                this.cerrarDetalle();
                this.cargarSesionesTutorFiltradas();
            },
            error: (err) => {
                console.error('Error al cancelar:', err);
                this.errorMessage = err?.error?.message || 'Error al cancelar la reserva.';
                this.cerrarConfirmacionCancelacion();
                setTimeout(() => this.errorMessage = '', 5000);
            }
        });
    }
    verHojaRuta(idReserva: number): void {
        console.log('Abriendo hoja de ruta reserva:', idReserva);

        if (!idReserva) {
            console.error('No se recibió idReserva.');
            return;
        }

        this.router.navigate(['/tutor/plan', idReserva]);
    }
    irCatalogo(): void { this.router.navigate(['/tutor/catalogo-instructor']); }
    normalizarTexto(t: string): string { return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); }
}