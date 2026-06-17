import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConteoSolicitudes, SolicitudesService } from '../../services/solicitudes.service';

@Component({
  selector: 'app-admin-inicio',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class Inicio implements OnInit {
  totalPendientes: number = 0;
  // pendientesHoy: number = 0;

  constructor(private solicitudesService: SolicitudesService) { }

  ngOnInit(): void {
    this.solicitudesService.obtenerConteo().subscribe({
      next: (conteo: ConteoSolicitudes) => {
        this.totalPendientes = conteo.totalPendientes;
        // this.pendientesHoy = conteo.pendientesHoy;
      },
      error: (err) => console.error('Error al cargar conteo:', err)
    });
  }
}