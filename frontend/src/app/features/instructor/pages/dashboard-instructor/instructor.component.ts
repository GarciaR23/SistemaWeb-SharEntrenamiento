import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InstructorApiService } from '../../services/instructor-api.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.scss'],
})
export class Inicio implements OnInit {
  // Datos del instructor
  nombreInstructor = '';

  // Estadísticas
  sesionesRealizadas = 0;
  pacientesActivos = 0;
  calificacion = 0;
  valoraciones = 0;

  // Gráfico
  evolucionData: any[] = [];

  // Agenda del día
  agendaHoy: any[] = [];

  // Pendientes
  pendientes: any[] = [];

  constructor(private instructorApiService: InstructorApiService) {}

  ngOnInit(): void {
    this.cargarDatosInstructor();
    // this.cargarDashboard();
  }

  cargarDatosInstructor(): void {
    const usuarioString = localStorage.getItem('authUser_instructor');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      
      // Si el login nos devuelve el idInstructor, lo usamos para traer sus datos reales
      if (usuario.idInstructor) {
        this.instructorApiService.getInstructorById(usuario.idInstructor).subscribe({
          next: (instructor) => {
            if (instructor && instructor.nombreCompleto) {
              // Obtener solo el primer nombre para el saludo si se desea, o todo el nombre
              this.nombreInstructor = this.obtenerPrimerNombre(instructor.nombreCompleto);
            }
          },
          error: (error) => {
            console.error('Error al cargar datos del instructor:', error);
            // Fallback al correo en caso de error
            this.nombreInstructor = this.extraerNombreDeEmail(usuario.email);
          }
        });
      } else {
        // Fallback si no hay idInstructor
        this.nombreInstructor = usuario.nombreCompleto || usuario.nombres || usuario.nombre || this.extraerNombreDeEmail(usuario.email);
      }
    }
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

  // cargarDashboard() {
  //   // Obtener información desde un servicio
  // }
}

