import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.scss'],
})
export class Inicio {
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

  // Aquí luego llamarás al backend
  // ngOnInit(): void {
  //   this.cargarDashboard();
  // }

  // cargarDashboard() {
  //   // Obtener información desde un servicio
  // }
}
