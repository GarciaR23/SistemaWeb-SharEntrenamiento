import { Component, OnInit } from '@angular/core';
import { SolicitudesService, SolicitudInstructor } from '../services/solicitudes.service';
import { CommonModule} from '@angular/common';
import { RevisionDocumento } from "../revision-documento/revision-documento";

@Component({
  selector: 'app-solicitud',
  imports: [CommonModule, RevisionDocumento],
  templateUrl: './solicitud.html',
  styleUrls: ['./solicitud.scss'],
})
export class Solicitud implements OnInit {
  listaSolicitudes: SolicitudInstructor[] = [];
  totalPendientes: number = 0;
  cargando: boolean = true;

  constructor(private solicitudesService: SolicitudesService) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.solicitudesService.obtenerSolicitudes().subscribe({
      next: (data) => {
        this.listaSolicitudes = data || [];
        this.totalPendientes = this.listaSolicitudes.length;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al recuperar solicitudes de la base de datos:', err);
        this.cargando = false;
      }
    });
  }

}
