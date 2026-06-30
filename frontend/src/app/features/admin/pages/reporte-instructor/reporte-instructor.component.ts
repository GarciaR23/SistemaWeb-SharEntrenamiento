
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InstructorMonitoreo } from '../../models/instructor-monitoreo.model';
import { ConteoInstructor, MonitoreoService } from '../../services/monitoreo.service';
import { FiltroInstructorService } from '../../services/filtro-instructor.service';

@Component({
  selector: 'app-reporte-instructor',
  imports: [FormsModule],
  templateUrl: './reporte-instructor.component.html',
  styleUrls: ['./reporte-instructor.component.scss'],
})
export class ReporteInstructor implements OnInit {
  instructores: InstructorMonitoreo[] = [];
  instructoresPaginados: InstructorMonitoreo[] = [];
  conteo: ConteoInstructor = { totalInstructor: 0, activoInstructor: 0, pendienteInstructor: 0 };
  terminoBusqueda = '';

  pageSize = 5;
  paginaActual = 1;
  totalPaginas = 0;

  constructor(
    private monitoreoService: MonitoreoService,
    private filtroService: FiltroInstructorService
  ) { }

  ngOnInit(): void {
    this.cargarInstructores();
    this.cargarConteo();
  }

  cargarInstructores(): void {
    this.monitoreoService.obtenerInstructores().subscribe({
      next: (data) => {
        this.instructores = data;
        this.totalPaginas = Math.ceil(this.instructores.length / this.pageSize);
        this.irPagina(1);
      },
      error: (err) => console.error('Error al cargar instructores:', err),
    });
  }

  cargarConteo(): void {
    this.monitoreoService.obtenerConteoInstructor().subscribe({
      next: (data) => (this.conteo = data),
      error: (err) => console.error('Error al cargar conteo:', err),
    });
  }

  buscar(nombre: string): void {
    if (!nombre.trim()) {
      this.cargarInstructores();
      return;
    }
    this.filtroService.buscarPorNombre(nombre).subscribe({
      next: (data) => {
        this.instructores = data;
        this.totalPaginas = Math.ceil(this.instructores.length / this.pageSize);
        this.irPagina(1);
      },
      error: () => {
        this.instructores = [];
        this.instructoresPaginados = [];
      }
    });
  }

  irPagina(pagina: number): void {
    this.paginaActual = pagina;
    const inicio = (pagina - 1) * this.pageSize;
    this.instructoresPaginados = this.instructores.slice(inicio, inicio + this.pageSize);
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'activo': return 'status-activo';
      case 'suspendido': return 'status-suspendido';
      case 'pendiente_validacion': return 'status-pendiente';
      default: return '';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'activo': return 'ACTIVO';
      case 'pendiente_validacion': return 'PENDIENTE';
      case 'pendiente_subsanacion': return 'OBSERVADO';
      case 'suspendido': return 'SUSPENDIDO';
      default: return estado;
    }
  }

  getEstrellas(puntaje: number): string {
    if (!puntaje) return '☆☆☆☆☆';
    const llenas = Math.round(puntaje);
    return '★'.repeat(llenas) + '☆'.repeat(5 - llenas);
  }
}
