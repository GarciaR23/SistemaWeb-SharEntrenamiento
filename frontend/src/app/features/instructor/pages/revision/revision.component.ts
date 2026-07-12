import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-revision',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss'],
})
export class RevisionComponent {
   alertas = [
    {
      texto: '3 cruces de horario detectados.'
    },
  ];

  ultimaActualizacion = '08/07/2026 - 10:45 AM';

  filtroActivo = 'recientes';

  solicitudes = [
    {
      nombre: 'Juan Pérez García',
      fecha: '08/07/2026',
      hora: '09:30 AM',
      duracion: '15 min',
      sede: 'Sede Central',
      edad: 28,
      img: 'https://i.pravatar.cc/150?img=11'
    },
    {
      nombre: 'María López Ramos',
      fecha: '08/07/2026',
      hora: '08:45 AM',
      duracion: '20 min',
      sede: 'Sede Norte',
      edad: 34,
      img: 'https://i.pravatar.cc/150?img=32'
    },
    {
      nombre: 'Carlos Fernández Díaz',
      fecha: '07/07/2026',
      hora: '04:10 PM',
      duracion: '12 min',
      sede: 'Sede Sur',
      edad: 41,
      img: ''
    },
    {
      nombre: 'Ana Torres Castillo',
      fecha: '07/07/2026',
      hora: '02:20 PM',
      duracion: '18 min',
      sede: 'Sede Este',
      edad: 25,
      img: 'https://i.pravatar.cc/150?img=5'
    },
    {
      nombre: 'Luis Mendoza Rojas',
      fecha: '06/07/2026',
      hora: '11:00 AM',
      duracion: '10 min',
      sede: 'Sede Oeste',
      edad: 37,
      img: ''
    }
  ];

  setFiltro(filtro: string): void {
    this.filtroActivo = filtro;
  }

  obtenerSolicitudes(): void {
    // Aquí irá la llamada al backend
  }
}
