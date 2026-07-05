import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bitacora',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.scss'],
})
export class BitacoraComponent {
  // Sin alertas hasta obtener datos del backend
  alertas: any[] = [];

  // Sin información inicial
  ultimaActualizacion = '';

  // Filtro por defecto
  filtroActivo = 'recientes';

  // Sin solicitudes (mostrará el Empty State)
  solicitudes: any[] = [];

  setFiltro(filtro: string): void {
    this.filtroActivo = filtro;

    // Aquí luego podrás consultar al backend según el filtro
    // this.obtenerSolicitudes(filtro);
  }

  // Método preparado para cuando conectes la API
  obtenerSolicitudes(): void {
    // Aquí llamarás a tu servicio
  }
}
