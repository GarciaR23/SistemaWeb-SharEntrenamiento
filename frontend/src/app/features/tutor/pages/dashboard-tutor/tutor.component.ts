import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorApiService, TutorDto, PacienteDto } from '../../services/tutor-api.service';
import { InstructorApiService, InstructorDto } from '../../../instructor/services/instructor-api.service';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.scss'],
})
export class Inicio implements OnInit {
  tutor: TutorDto | null = null;
  paciente: PacienteDto | null = null;
  instructores: InstructorDto[] = [];

  loading = true;
  errorMessage = '';

  constructor(
    private tutorApiService: TutorApiService,
    private instructorApiService: InstructorApiService
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
    this.instructorApiService.getInstructores().subscribe({
      next: (instructores) => {
        console.log('Instructores recibidos:', instructores);
        this.instructores = instructores.slice(0, 4);
      },
      error: (error) => {
        console.error('Error al cargar instructores:', error);
      },
    });
  }

  obtenerPrimerNombre(nombreCompleto: string | undefined | null): string {
    if (!nombreCompleto) {
      return '';
    }

    return nombreCompleto.trim().split(' ')[0];
  }

  formatearGrado(grado: string | undefined): string {
    if (!grado) return 'No registrado';

    const grados: Record<string, string> = {
      uno: 'Leve',
      dos: 'Moderado',
      tres: 'Severo',
    };

    return grados[grado] ?? grado;
  }
}


