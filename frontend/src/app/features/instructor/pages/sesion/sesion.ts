import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type EstadoSesion = 'pendiente' | 'en_curso' | 'visto' | 'finalizado' | 'reprogramado';

interface SesionProgramada{
  id: number;
  codigo: string;
  paciente: string;
  edad: number;
  documento: string;
  fecha: string;
  distrito: string;
  duracionMin: number;
  especialidad: string;
  estado: EstadoSesion;
  minutosRestantes?: number;
  miniatura: string;
}

@Component({
  selector: 'app-sesion',
  imports: [CommonModule],
  templateUrl: './sesion.html',
  styleUrl: './sesion.scss',
})
export class SesionComponent {
  filtroActivo: 'recientes' | 'reprogramado' | 'finalizado' = 'recientes';

  // Se llenará desde el backend
  sesiones: SesionProgramada[] = [];

  get sesionesFiltradas(): SesionProgramada[] {
    if (this.filtroActivo === 'recientes') {
      return this.sesiones.filter(
        (s) => s.estado !== 'finalizado' && s.estado !== 'reprogramado'
      );
    }

    return this.sesiones.filter((s) => s.estado === this.filtroActivo);
  }

  get totalPendientes(): number {
    return this.sesiones.filter(
      (s) => s.estado === 'pendiente' || s.estado === 'en_curso'
    ).length;
  }

  cambiarFiltro(
    filtro: 'recientes' | 'reprogramado' | 'finalizado'
  ): void {
    this.filtroActivo = filtro;

    // Aquí podrás volver a consultar al backend si el filtro cambia
    // this.obtenerSesiones();
  }

  obtenerEstadoTexto(sesion: SesionProgramada): string {
    switch (sesion.estado) {
      case 'en_curso':
        return 'EN CURSO';
      case 'visto':
        return 'VISTO';
      case 'finalizado':
        return 'FINALIZADO';
      case 'reprogramado':
        return 'REPROGRAMADO';
      default:
        return '';
    }
  }

  obtenerClaseEstado(sesion: SesionProgramada): string {
    return sesion.estado.replace('_', '-');
  }

  mostrarHeaderTiempo(sesion: SesionProgramada): boolean {
    return (
      sesion.estado === 'en_curso' ||
      sesion.estado === 'visto'
    );
  }

  // Método para consumir la API
  obtenerSesiones(): void {
    // Aquí llamarás a tu servicio
  }

  empezarSesion(sesion: SesionProgramada): void {
    // Lógica
  }

  reprogramarSesion(sesion: SesionProgramada): void {
    // Lógica
  }

  registrarAsistencia(sesion: SesionProgramada): void {
    // Lógica
  }

  registrarIncidencia(sesion: SesionProgramada): void {
    // Lógica
  }

  crearReporte(sesion: SesionProgramada): void {
    // Lógica
  }
}
