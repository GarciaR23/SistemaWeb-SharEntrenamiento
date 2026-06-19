import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConteoSolicitudes, SolicitudesService } from '../../services/solicitudes.service';
import { MonitoreoService } from '../../services/monitoreo.service';

@Component({
  selector: 'app-admin-inicio',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class Inicio implements OnInit {
  totalPendientes: number = 0;
  totalActivos: number = 0;

  constructor(
    private solicitudesService: SolicitudesService,
    private monitoreoService: MonitoreoService
  ) { }

  ngOnInit(): void {
    this.solicitudesService.obtenerConteo().subscribe({
      next: (conteo: ConteoSolicitudes) => {
        this.totalPendientes = conteo.totalPendientes;
      },
      error: (err) => console.error('Error al cargar conteo:', err),
    });

    this.monitoreoService.obtenerConteoInstructor().subscribe({
      next: (conteo) => {
        this.totalActivos = conteo.activoInstructor;
      },
      error: (err) => console.error('Error al cargar activos:', err),
    });
  }
}