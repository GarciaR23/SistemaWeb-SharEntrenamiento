import { Component, OnInit } from '@angular/core';
import { SolicitudesService, ConteoSolicitudes } from '../../services/solicitudes.service';
import { CommonModule } from '@angular/common';
import { RevisionDocumento } from '../revision-documento/revision-documento.component';
import { SolicitudInstructor } from '../../models/solicitud.model';

@Component({
  standalone: true,
  selector: 'app-solicitud',
  imports: [CommonModule, RevisionDocumento],
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss'],
})
export class Solicitud implements OnInit {
  listaSolicitudes: SolicitudInstructor[] = [];
  totalPendientes: number = 0;
  pendientesHoy: number = 0;
  cargando: boolean = true;

  constructor(private solicitudesService: SolicitudesService) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.solicitudesService.obtenerTodo().subscribe({
      next: (result) => {
        this.listaSolicitudes = result.solicitudes || [];
        this.totalPendientes = result.conteo.totalPendientes;
        this.pendientesHoy = result.conteo.pendientesHoy;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al recuperar solicitudes:', err);
        this.cargando = false;
      }
    });
  }

  removerCard(idInstructor: number): void {
    this.listaSolicitudes = this.listaSolicitudes.filter(s => s.idInstructor !== idInstructor);
    this.totalPendientes = this.listaSolicitudes.length;
  }
}