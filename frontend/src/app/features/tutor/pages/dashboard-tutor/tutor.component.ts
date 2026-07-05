import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TutorApiService, TutorDto } from '../../services/tutor-api.service';
import { PacienteDto } from '../../models/paciente.model';
import { InstructorExplorarDto } from '../../models/instructor-explorar.model';
import { ExplorarInstructorApiService } from '../../services/explorar-instructor-api.service';
import { ProgresoKpiService } from '../../services/progreso-kpi.service';
import { StatCard } from '../../models/stat-card.model';

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

  stats: StatCard[] = [];
  proximaSesion: ProximaSesion | null = null;

  pageSize = 4;
  paginaActual = 1;
  totalPaginas = 0;

  loading = true;
  errorMessage = '';

  constructor(
    private tutorApiService: TutorApiService,
    private instructorApiService: ExplorarInstructorApiService,
    private progresoKpiService: ProgresoKpiService,
    private router: Router
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
            if (this.paciente) {
              this.cargarProgresoKpi(this.paciente.idPaciente);
            } else {
              this.loading = false;
            }
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

  cargarProgresoKpi(idPaciente: number): void {
    this.progresoKpiService.obtenerKpi(idPaciente).subscribe({
      next: (kpi) => {
        if (kpi.totalReportesEvaluados > 0) {
          this.stats = [
            {
              id: 'resistencia',
              title: 'RESISTENCIA',
              score: kpi.promedioResistencia,
              maxScore: 10,
              trend: this.formatearTendencia(kpi.tendenciaResistencia),
              color: '#6dffd0',
              bgColor: 'rgba(109, 255, 208, 0.1)',
            },
            {
              id: 'equilibrio',
              title: 'EQUILIBRIO',
              score: kpi.promedioEquilibrio,
              maxScore: 10,
              trend: this.formatearTendencia(kpi.tendenciaEquilibrio),
              color: '#60a5fa',
              bgColor: 'rgba(96, 165, 250, 0.1)',
            },
            {
              id: 'coordinacion',
              title: 'COORDINACIÓN',
              score: kpi.promedioCoordinacion,
              maxScore: 10,
              trend: this.formatearTendencia(kpi.tendenciaCoordinacion),
              color: '#f59e0b',
              bgColor: 'rgba(245, 158, 11, 0.1)',
            },
          ];
        }
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  formatearTendencia(valor: number): string {
    if (valor > 0) return `+${valor}`;
    if (valor < 0) return `${valor}`;
    return '0';
  }

  cargarInstructores(): void {
    this.instructorApiService.getInstructoresExplorar().subscribe({
      next: (instructores) => {
        this.instructores = instructores;
        this.totalPaginas = Math.ceil(this.instructores.length / this.pageSize);
        this.irPagina(1);
      },
      error: (error) => console.error('Error al cargar instructores:', error),
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

  verPerfil(idInstructor: number): void {
    this.router.navigate(['/tutor/perfil-instructor', idInstructor]);
  }
}