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

  constructor(private route: ActivatedRoute, private router: Router, private tutorApiService: TutorApiService) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('idInstructor'));
    if (!id) { this.errorMessage = 'Instructor no válido.'; this.cargando = false; return; }
    this.idInstructor = id; this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.cargando = true; this.errorMessage = '';
    forkJoin({
      resumen: this.tutorApiService.getPerfilInstructorResumen(this.idInstructor),
      sedes: this.tutorApiService.getPerfilInstructorSedes(this.idInstructor),
      servicios: this.tutorApiService.getPerfilInstructorServicios(this.idInstructor),
      calificaciones: this.tutorApiService.getPerfilInstructorCalificaciones(this.idInstructor)
    }).subscribe({
      next: (r) => { this.resumen = r.resumen; this.sedes = r.sedes || []; this.servicios = r.servicios || []; this.calificaciones = r.calificaciones || []; this.cargando = false; },
      error: (err) => { console.error('Error al cargar perfil:', err); this.errorMessage = 'No se pudo cargar el perfil.'; this.cargando = false; }
    });
  }

  volverCatalogo(): void { this.router.navigate(['/tutor/catalogo-instructor']); }
  solicitarSesion(): void { this.router.navigate(['/tutor/reserva'], { queryParams: { idInstructor: this.idInstructor, idSede: this.sedes[0]?.idSede || null, tarifaHora: this.servicios[0]?.tarifaHora || null } }); }
  obtenerImagenPerfil(): string { return this.resumen?.urlImagenPerfil || 'https://via.placeholder.com/500x400?text=Instructor'; }
  obtenerDistrito(): string { return this.resumen?.distrito || 'Sin distrito'; }

  obtenerHorarioPrincipal(): string {
    if (!this.servicios?.length) return 'Horario no registrado';
    return this.servicios.map(s => `${s.diaSemana || 'Sin día'} ${s.horarioInicio?.substring(0, 5) || '--:--'} - ${s.horarioFinal?.substring(0, 5) || '--:--'}`).join(' | ');
  }

  obtenerTarifaBase(): string { const s = this.servicios[0]; return s?.tarifaHora != null ? `S/ ${Number(s.tarifaHora).toFixed(0)}` : 'S/ --'; }
  obtenerPromedioCalificacion(): string { if (!this.calificaciones.length) return '0.0'; const s = this.calificaciones.reduce((a, c) => a + Number(c.puntajeEstrellas || 0), 0); return (s / this.calificaciones.length).toFixed(1); }
  obtenerTotalSesiones(): number { return this.calificaciones.length; }
  obtenerIniciales(n: string): string { if (!n) return 'US'; const p = n.trim().split(' '); return p.length === 1 ? p[0].substring(0, 2).toUpperCase() : `${p[0][0]}${p[1][0]}`.toUpperCase(); }
  obtenerEstrellas(p: number | null): string { const v = Number(p || 0); return '★'.repeat(v) + '☆'.repeat(5 - v); }
  obtenerFechaCalificacion(f: string | null): string { return f ? new Date(f).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Sin fecha'; }
  obtenerImagenSede(s: InstructorPerfilSedeDto): string { return s.urlImagenSede1 || 'https://via.placeholder.com/600x350?text=Sede'; }
  obtenerNombreDistrito(d: string): string { return d || 'Sin distrito'; }
}