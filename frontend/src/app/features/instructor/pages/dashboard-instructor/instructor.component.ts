import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InstructorApiService } from '../../services/instructor-api.service';
import { DashboardService } from '../../services/dashboard.service';
import { AgendaService } from '../../services/agenda.service';
import { AlertasService } from '../../services/alertas.service';
import { AgendaHoy } from '../../models/agenda-hoy.model';
import { AlertaPendiente } from '../../models/alerta-pendiente.model';
import { EstadisticaDashboard } from '../../models/estadistica-dashboard.model';
import { EvolucionDiaria } from '../../models/evolucion-diaria.model';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.scss'],
})
export class Inicio implements OnInit {
  nombreInstructor = '';
  idInstructor: number | null = null;

  sesionesRealizadas = 0;
  porcentajeSesiones = 0;
  pacientesActivos = 0;
  porcentajePacientes = 0;
  calificacion = 0;
  valoraciones = 0;

  evolucionData: any[] = [];
  agendaHoy: any[] = [];
  pendientes: any[] = [];
  fechaActual: string = '';

  constructor(
    private instructorApiService: InstructorApiService,
    private dashboardService: DashboardService,
    private agendaService: AgendaService,
    private alertasService: AlertasService
  ) { }

  ngOnInit(): void {
    this.obtenerFechaActual();
    this.cargarDatosInstructor();
  }

  obtenerFechaActual(): void {
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    };
    this.fechaActual = new Date().toLocaleDateString('es-ES', opciones);
    this.fechaActual = this.fechaActual.charAt(0).toUpperCase() + this.fechaActual.slice(1);
  }

  cargarDatosInstructor(): void {
    const usuarioString = localStorage.getItem('authUser_instructor');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);

      if (usuario.idInstructor) {
        this.idInstructor = usuario.idInstructor;

        this.instructorApiService.getInstructorById(usuario.idInstructor).subscribe({
          next: (instructor) => {
            if (instructor && instructor.nombreCompleto) {
              this.nombreInstructor = this.obtenerPrimerNombre(instructor.nombreCompleto);
            }
          },
          error: () => {
            this.nombreInstructor = this.extraerNombreDeEmail(usuario.email);
          }
        });

        this.cargarDashboard();
        this.cargarAgenda();
        this.cargarAlertas();
      } else {
        this.nombreInstructor = usuario.nombreCompleto || this.extraerNombreDeEmail(usuario.email);
      }
    }
  }

  cargarDashboard(): void {
    if (!this.idInstructor) return;

    this.dashboardService.obtenerEstadisticas(this.idInstructor).subscribe({
      next: (stats: EstadisticaDashboard) => {
        this.sesionesRealizadas = stats.sesionesRealizadas;
        this.porcentajeSesiones = stats.porcentajeSesiones;
        this.pacientesActivos = stats.pacientesActivos;
        this.porcentajePacientes = stats.porcentajePacientes;
        this.calificacion = stats.calificacion;
        this.valoraciones = stats.totalValoraciones;
      },
      error: (err) => console.error('Error al cargar estadísticas:', err)
    });

    this.dashboardService.obtenerEvolucion(this.idInstructor).subscribe({
      next: (data: EvolucionDiaria[]) => {
        const maxSesiones = Math.max(...data.map(d => d.totalSesiones), 1);
        this.evolucionData = data.map(item => ({
          dia: item.nombreDia.substring(0, 3),
          valor: item.totalSesiones,
          height: ((item.totalSesiones / maxSesiones) * 100) + '%'
        }));
      },
      error: (err) => console.error('Error al cargar evolución:', err)
    });
  }

  cargarAgenda(): void {
    if (!this.idInstructor) return;

    this.agendaService.obtenerAgendaHoy(this.idInstructor).subscribe({
      next: (data: AgendaHoy[]) => {
        this.agendaHoy = data.map(item => ({
          idSesion: item.idSesion,
          hora: item.horaInicio?.substring(0, 5) || '',
          paciente: item.nombreCompleto || '',
          img: item.fotoPaciente || null,
          sede: item.sede || '',
          distrito: item.distrito || '',
          estado: 'Pendiente',
          claseEstado: 'pendiente'
        }));
      },
      error: (err) => console.error('Error al cargar agenda:', err)
    });
  }

  cargarAlertas(): void {
    if (!this.idInstructor) return;

    this.alertasService.obtenerAlertasPendientes(this.idInstructor).subscribe({
      next: (data: AlertaPendiente[]) => {
        this.pendientes = data.map(item => ({
          idReferencia: item.idReferencia,
          tipo: item.tipoAlerta === 'pendiente_envio' ? 'alerta' : 'reporte',
          titulo: item.tipoAlerta === 'pendiente_envio' ? 'Hoja de ruta pendiente' : 'Ajuste requerido',
          descripcion: item.mensaje || '',
          accion: item.tipoAlerta === 'pendiente_envio' ? 'Configurar' : 'Revisar'
        }));
      },
      error: (err) => console.error('Error al cargar alertas:', err)
    });
  }

  private obtenerPrimerNombre(nombreCompleto: string): string {
    if (!nombreCompleto) return '';
    return nombreCompleto.trim().split(' ')[0];
  }

  private extraerNombreDeEmail(email: string): string {
    if (!email) return '';
    const partes = email.split('@');
    if (partes.length > 0) {
      const nombre = partes[0];
      return nombre.charAt(0).toUpperCase() + nombre.slice(1);
    }
    return '';
  }
}