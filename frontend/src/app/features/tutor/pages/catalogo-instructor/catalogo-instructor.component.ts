import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TutorApiService } from '../../services/tutor-api.service';
import { InstructorCatalogoDto } from '../../models/instructor-catalogo.model';

@Component({
  selector: 'app-catalogo-instructor',
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo-instructor.component.html',
  styleUrls: ['./catalogo-instructor.component.scss'],
})
export class CatalogoInstructor implements OnInit {
  instructores: InstructorCatalogoDto[] = [];
  cargando = true;
  errorMessage = '';

  textoBusqueda = '';
  distritoSeleccionado = '';
  especialidadSeleccionada = '';

  mostrarFiltrosAvanzados = false;
  tarifaSeleccionada = '';
  turnoSeleccionado = '';

  distritos: string[] = [];
  especialidades: string[] = [];

  constructor(
    private tutorApiService: TutorApiService,
    private router: Router
  ) { }

  ngOnInit(): void { this.cargarCatalogo(); }

  cargarCatalogo(): void {
    this.cargando = true;
    this.errorMessage = '';
    this.tutorApiService.buscarInstructoresCatalogo({
      texto: this.textoBusqueda, distrito: this.distritoSeleccionado,
      especialidad: this.especialidadSeleccionada,
      tarifaMin: this.obtenerTarifaMin(), tarifaMax: this.obtenerTarifaMax(),
      turno: this.turnoSeleccionado,
    }).subscribe({
      next: (response) => {
        this.instructores = response || [];
        this.cargarOpcionesFiltros(this.instructores);
        this.cargando = false;
      },
      error: (err) => { console.error('Error al cargar catálogo:', err); this.errorMessage = 'No se pudieron cargar los instructores.'; this.cargando = false; }
    });
  }

  buscar(): void { this.cargarCatalogo(); }
  limpiarFiltros(): void { this.textoBusqueda = ''; this.distritoSeleccionado = ''; this.especialidadSeleccionada = ''; this.tarifaSeleccionada = ''; this.turnoSeleccionado = ''; this.cargarCatalogo(); }
  toggleFiltrosAvanzados(): void { this.mostrarFiltrosAvanzados = !this.mostrarFiltrosAvanzados; }

  cargarOpcionesFiltros(instructores: InstructorCatalogoDto[]): void {
    this.distritos = [...new Set(instructores.map(i => i.distritoSede || i.distrito).filter((v): v is string => !!v))];
    this.especialidades = [...new Set(instructores.map(i => i.especialidad).filter((v): v is string => !!v))];
  }

  obtenerImagen(i: InstructorCatalogoDto): string { return i.urlImagenPerfil || 'https://via.placeholder.com/500x400?text=Instructor'; }
  obtenerDistrito(i: InstructorCatalogoDto): string { return i.distritoSede || i.distrito || 'Sin distrito'; }
  obtenerDireccion(i: InstructorCatalogoDto): string { return i.direccionSede || i.direccion || 'Sin sede registrada'; }
  obtenerTarifa(i: InstructorCatalogoDto): string { return i.tarifaHora != null ? `S/ ${Number(i.tarifaHora).toFixed(0)}/h` : 'S/ --'; }

  private readonly ordenDias: Record<string, number> = {
    'L': 1, 'M': 2, 'Mi': 3, 'J': 4, 'V': 5, 'S': 6, 'D': 7
  };

  obtenerHorario(instructor: InstructorCatalogoDto): string {
    if (!instructor.horarios?.length) return 'Horario no registrado';
    return instructor.horarios
      .sort((a, b) => (this.ordenDias[a.diaSemana?.split(', ')[0] || ''] || 8) - (this.ordenDias[b.diaSemana?.split(', ')[0] || ''] || 8))
      .map(h => `${h.diaSemana || 'Sin día'} ${h.horarioInicio?.substring(0, 5) || '--:--'} - ${h.horarioFinal?.substring(0, 5) || '--:--'}`)
      .join(' | ');
  }

  obtenerRating(i: InstructorCatalogoDto): string { return i.promedioCalificacion != null ? Number(i.promedioCalificacion).toFixed(1) : '0.0'; }
  obtenerSesiones(i: InstructorCatalogoDto): number { return i.totalSesiones != null ? Number(i.totalSesiones) : 0; }

  obtenerTarifaMin(): number | null {
    switch (this.tarifaSeleccionada) { case '0-50': return 0; case '50-80': return 50; case '80-120': return 80; case '120-mas': return 120; default: return null; }
  }
  obtenerTarifaMax(): number | null {
    switch (this.tarifaSeleccionada) { case '0-50': return 50; case '50-80': return 80; case '80-120': return 120; case '120-mas': return null; default: return null; }
  }

  verPerfil(instructor: InstructorCatalogoDto): void { this.router.navigate(['/tutor/perfil-instructor', instructor.idInstructor]); }
}