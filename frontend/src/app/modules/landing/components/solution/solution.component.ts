import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  title: string;
  description: string;
  icon: string;
  isFeatured?: boolean;
}

@Component({
  selector: 'app-solution',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solution.component.html',
  styleUrl: './solution.component.css'
})
export class SolutionComponent {
  features: Feature[] = [
    {
      title: 'Smart Match',
      description: 'Algoritmo propietario que cruza perfiles sensoriales con especialidades técnicas de instructores.',
      icon: 'hub' // Usando nombres de Google Material Icons
    },
    {
      title: 'Monitoreo Vital',
      description: 'Seguimiento en tiempo real de la sesión para asegurar la integridad física y el bienestar emocional.',
      icon: 'insights',
      isFeatured: true // Activa el borde verde
    },
    {
      title: 'Protocolos Pro',
      description: 'Cada instructor sigue protocolos de intervención validados por expertos en kinesiología y psicología.',
      icon: 'verified_user'
    }
  ];
}