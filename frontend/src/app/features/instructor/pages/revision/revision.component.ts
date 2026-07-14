import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
import { RevisionService } from '../../services/revision.service';
import { FechaCritica } from '../../models/fecha-critica.model';
import { ContadorPendiente, RecienteSemanal } from '../../models/revision-contador.model';
import { SolicitudRevision } from '../../models/solicitud-revision.model';

@Component({
  selector: 'app-revision',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss'],
})
export class RevisionComponent implements OnInit {
  idInstructor: number | null = null;

  alertas: { texto: string }[] = [];
  ultimaActualizacion = '';
  filtroActivo = 'reciente';
  todasLasSolicitudes: any[] = [];
  solicitudes: any[] = [];
  totalPendientes = 0;

  modalFechaCriticaAbierto = false;
  fechaCritica: FechaCritica | null = null;

  modalConfirmacionAbierto = false;
  idDetalleSeleccionado: number | null = null;
  accionSeleccionada: 'aceptar' | 'rechazar' = 'aceptar';

  cargando = false;

  constructor(
    private revisionService: RevisionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.obtenerIdInstructor();
    this.cargarSolicitudes();
    this.cargarContador();
    this.obtenerUltimaActualizacion();
  }

  obtenerIdInstructor(): void {
    const usuarioString = localStorage.getItem('authUser_instructor');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.idInstructor = usuario.idInstructor || null;
    }
  }

  cargarSolicitudes(): void {
    if (!this.idInstructor) return;
    this.cargando = true;

    this.revisionService.obtenerSolicitudesRevision(this.idInstructor).subscribe({
      next: (data: SolicitudRevision[]) => {
        this.todasLasSolicitudes = data.map(sol => ({
          idDetalle: sol.idDetalle,
          idReserva: sol.idReserva,
          nombre: sol.nombrePaciente,
          fecha: this.formatearFecha(sol.fechaReserva),
          hora: this.formatearHora(sol.horaInicio),
          duracion: sol.duracionEntrenamiento?.replace('PT', '').replace('H', 'h ').replace('M', 'min') || '',
          sede: sol.zonaSede || '',
          edad: sol.edad,
          img: sol.urlImagenPaciente || ''
        }));
        this.cargando = false;
        this.aplicarFiltro();
      },
      error: (err) => {
        console.error('Error al cargar solicitudes:', err);
        this.cargando = false;
      }
    });
  }

  cargarContador(): void {
    if (!this.idInstructor) return;
    this.revisionService.obtenerContadorPendiente(this.idInstructor).subscribe({
      next: (data: ContadorPendiente) => { this.totalPendientes = data.totalPendientes; }
    });
  }

  obtenerUltimaActualizacion(): void {
    const ahora = new Date();
    this.ultimaActualizacion = ahora.toLocaleDateString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }) + ' - ' + ahora.toLocaleTimeString('es-ES', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  }

  setFiltro(filtro: string): void {
    this.filtroActivo = filtro;
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    if (!this.idInstructor) return;
    this.revisionService.obtenerRecienteSemanal(this.idInstructor).subscribe({
      next: (data: RecienteSemanal[]) => {
        const idsFiltrados = data
          .filter(item => item.clasificacion === this.filtroActivo)
          .map(r => r.idDetalle);
        this.solicitudes = this.todasLasSolicitudes.filter(
          sol => idsFiltrados.includes(sol.idDetalle)
        );
      }
    });
  }

  abrirFechaCritica(idReserva: number): void {
    this.revisionService.obtenerFechaCritica(idReserva).subscribe({
      next: (data: FechaCritica) => {
        this.fechaCritica = data;
        this.modalFechaCriticaAbierto = true;
      },
      error: (err) => console.error('Error al cargar fecha crítica:', err)
    });
  }

  cerrarFechaCritica(): void {
    this.modalFechaCriticaAbierto = false;
    this.fechaCritica = null;
  }

  confirmarAccion(idDetalle: number, accion: 'aceptar' | 'rechazar'): void {
    this.idDetalleSeleccionado = idDetalle;
    this.accionSeleccionada = accion;
    this.modalConfirmacionAbierto = true;
  }

  ejecutarAccion(): void {
    if (!this.idDetalleSeleccionado) return;

    const request = {
      idDetalle: this.idDetalleSeleccionado,
      aprobada: this.accionSeleccionada === 'aceptar'
    };

    this.revisionService.decidirRevision(request).subscribe({
      next: () => {
        this.modalConfirmacionAbierto = false;
        this.idDetalleSeleccionado = null;
        this.cargarSolicitudes();
        this.cargarContador();
        this.obtenerUltimaActualizacion();

        if (this.accionSeleccionada === 'aceptar') {
          this.router.navigate(['/instructor/hoja-ruta']);
        }
      },
      error: (err) => {
        console.error('Error al procesar decisión:', err);
        this.modalConfirmacionAbierto = false;
      }
    });
  }

  cerrarConfirmacion(): void {
    this.modalConfirmacionAbierto = false;
    this.idDetalleSeleccionado = null;
  }

  private formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }

  private formatearHora(hora: string): string {
    if (!hora) return '';
    const [h, m] = hora.split(':');
    const horaNum = parseInt(h);
    const ampm = horaNum >= 12 ? 'PM' : 'AM';
    const hora12 = horaNum > 12 ? horaNum - 12 : (horaNum === 0 ? 12 : horaNum);
    return `${hora12}:${m} ${ampm}`;
  }
}