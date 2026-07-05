import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { TutorApiService } from '../../services/tutor-api.service';
import { InstructorPerfilCalificacionDto } from '../../models/instructor-perfil-calificacion.model';
import { InstructorPerfilResumenDto } from '../../models/instructor-perfil.model';
import { InstructorPerfilSedeDto } from '../../models/instructor-perfil-sede.model';
import { InstructorPerfilServicioDto } from '../../models/instructor-perfil-servicio.model';

@Component({
  selector: 'app-perfil-instructor',
  imports: [CommonModule],
  templateUrl: './perfil-instructor.component.html',
  styleUrls: ['./perfil-instructor.component.scss']
})
export class PerfilInstructorComponent implements OnInit {
  idInstructor!: number;

  resumen: InstructorPerfilResumenDto | null = null;
  sedes: InstructorPerfilSedeDto[] = [];
  servicios: InstructorPerfilServicioDto[] = [];
  calificaciones: InstructorPerfilCalificacionDto[] = [];

  cargando = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tutorApiService: TutorApiService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('idInstructor'));

    if (!id) {
      this.errorMessage = 'Instructor no válido.';
      this.cargando = false;
      return;
    }

    this.idInstructor = id;
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.cargando = true;
    this.errorMessage = '';

    forkJoin({
      resumen: this.tutorApiService.getPerfilInstructorResumen(this.idInstructor),
      sedes: this.tutorApiService.getPerfilInstructorSedes(this.idInstructor),
      servicios: this.tutorApiService.getPerfilInstructorServicios(this.idInstructor),
      calificaciones: this.tutorApiService.getPerfilInstructorCalificaciones(this.idInstructor)
    }).subscribe({
      next: (response) => {
        this.resumen = response.resumen;
        this.sedes = response.sedes || [];
        this.servicios = response.servicios || [];
        this.calificaciones = response.calificaciones || [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar perfil del instructor:', err);
        this.errorMessage = 'No se pudo cargar el perfil del instructor.';
        this.cargando = false;
      }
    });
  }

  volverCatalogo(): void {
    this.router.navigate(['/tutor/catalogo-instructor']);
  }

  solicitarSesion(): void {
    const servicio = this.servicios[0];
    const sede = this.sedes[0];

    this.router.navigate(['/tutor/reserva'], {
      queryParams: {
        idInstructor: this.idInstructor,
        idSede: sede?.idSede || null,
        tarifaHora: servicio?.tarifaHora || null
      }
    });
  }

  obtenerImagenPerfil(): string {
    return this.resumen?.urlImagenPerfil || 'https://via.placeholder.com/500x400?text=Instructor';
  }

  obtenerDistrito(): string {
    return this.resumen?.distrito || 'Sin distrito';
  }

  obtenerHorarioPrincipal(): string {
    const servicio = this.servicios[0];

    if (!servicio || !servicio.diaDisponible || !servicio.horarioInicio || !servicio.horarioFinal) {
      return 'Horario no registrado';
    }

    return `${servicio.diaDisponible} | ${this.formatearHora(servicio.horarioInicio)} - ${this.formatearHora(servicio.horarioFinal)}`;
  }

  obtenerTarifaBase(): string {
    const servicio = this.servicios[0];

    if (!servicio || servicio.tarifaHora === null || servicio.tarifaHora === undefined) {
      return 'S/ --';
    }

    return `S/ ${Number(servicio.tarifaHora).toFixed(0)}`;
  }

  obtenerPromedioCalificacion(): string {
    if (this.calificaciones.length === 0) {
      return '0.0';
    }

    const suma = this.calificaciones.reduce((acc, item) => acc + Number(item.puntajeEstrellas || 0), 0);
    const promedio = suma / this.calificaciones.length;

    return promedio.toFixed(1);
  }

  obtenerTotalSesiones(): number {
    return this.calificaciones.length;
  }

  obtenerIniciales(nombre: string): string {
    if (!nombre) {
      return 'US';
    }

    const partes = nombre.trim().split(' ');

    if (partes.length === 1) {
      return partes[0].substring(0, 2).toUpperCase();
    }

    return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
  }

  obtenerEstrellas(puntaje: number | null): string {
    const valor = Number(puntaje || 0);
    return '★'.repeat(valor) + '☆'.repeat(5 - valor);
  }

  obtenerFechaCalificacion(fecha: string | null): string {
    if (!fecha) {
      return 'Sin fecha';
    }

    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  obtenerImagenSede(sede: InstructorPerfilSedeDto): string {
    return sede.urlImagenSede1 || 'https://via.placeholder.com/600x350?text=Sede';
  }

  obtenerNombreDistrito(distrito: string): string {
    return distrito || 'Sin distrito';
  }

  private formatearHora(hora: string): string {
    return hora ? hora.substring(0, 5) : '';
  }
}
