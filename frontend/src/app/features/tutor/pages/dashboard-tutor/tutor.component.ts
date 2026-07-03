import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TutorApiService, TutorDto } from '../../services/tutor-api.service';
import { PacienteDto } from '../../models/paciente.model';
import { InstructorExplorarDto } from '../../models/instructor-explorar.model';
import { ExplorarInstructorApiService } from '../../services/explorar-instructor-api.service';

export interface StatCard {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  trend: string;
  color: string;
  bgColor: string;
}

export interface ProximaSesion {
  instructorNombre: string;
  instructorEspecialidad: string;
  instructorFoto: string;
  fechaHora: string;
  ubicacion: string;
}

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.scss'],
})
export class Inicio implements OnInit {
  tutor: TutorDto | null = null;
  paciente: PacienteDto | null = null;
  instructores: InstructorExplorarDto[] = [];
  instructoresPaginados: InstructorExplorarDto[] = [];

  // Datos simulados para el Panel de Progreso
  // Sin datos por defecto — mostrar estado vacío cuando no hay registros en backend
  stats: StatCard[] = [];

  // Sin próxima sesión por defecto — quedará en null si no hay datos del backend
  proximaSesion: ProximaSesion | null = null;

  pageSize = 4;
  paginaActual = 1;
  totalPaginas = 0;

  loading = true;
  errorMessage = '';

  constructor(
    private tutorApiService: TutorApiService,
    private instructorApiService: ExplorarInstructorApiService
  ) { }

  ngOnInit(): void {
    this.cargarDatosTutor();
    this.cargarInstructores();
  }

  cargarDatosTutor(): void {
    const usuarioString = localStorage.getItem('authUser_tutor');
    if (!usuarioString) {
      this.loading = false;
      this.errorMessage = 'No se encontró la sesión del tutor.';
      return;
    }

    const usuario = JSON.parse(usuarioString);
    const idUsuario = usuario.idUsuario;

    this.tutorApiService.getTutorPorUsuario(idUsuario).subscribe({
      next: (tutor) => {
        this.tutor = tutor;
        this.tutorApiService.getPacientesPorTutor(tutor.idTutor).subscribe({
          next: (pacientes) => {
            this.paciente = pacientes.length > 0 ? pacientes[0] : null;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al cargar paciente:', error);
            this.errorMessage = 'No se pudo cargar el paciente.';
            this.loading = false;
          },
        });
      },
      error: (error) => {
        console.error('Error al cargar tutor:', error);
        this.errorMessage = 'No se pudo cargar la información del tutor.';
        this.loading = false;
      },
    });
  }

  cargarInstructores(): void {
    this.instructorApiService.getInstructoresExplorar().subscribe({
      next: (instructores) => {
        this.instructores = instructores;
        this.totalPaginas = Math.ceil(this.instructores.length / this.pageSize);
        this.irPagina(1);
      },
      error: (error) => {
        console.error('Error al cargar instructores:', error);
      },
    });
  }

  irPagina(pagina: number): void {
    this.paginaActual = pagina;
    const inicio = (pagina - 1) * this.pageSize;
    this.instructoresPaginados = this.instructores.slice(inicio, inicio + this.pageSize);
  }

  obtenerPrimerNombre(nombreCompleto: string | undefined | null): string {
    if (!nombreCompleto) return '';
    return nombreCompleto.trim().split(' ')[0];
  }

  formatearGrado(grado: string | undefined): string {
    if (!grado) return 'No registrado';
    const grados: Record<string, string> = { uno: 'Leve', dos: 'Moderado', tres: 'Severo' };
    return grados[grado] ?? grado;
  }
}