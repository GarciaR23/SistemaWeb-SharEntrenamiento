import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent {

  testimonials = [
    {
      text: 'La conexión con el instructor fue inmediata. El enfoque adaptado ha permitido que mi hijo disfrute del deporte sin barreras.',
      name: 'María García',
      role: 'Madre de familia',
      avatar: 'https://i.pravatar.cc/150?img=32'
    },
    {
      text: 'Como instructor certificado, esta plataforma me permite llegar a quienes más necesitan un entrenamiento especializado y seguro.',
      name: 'Carlos Ruiz',
      role: 'Instructor Certificado',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    {
      text: 'El sistema de monitoreo en tiempo real nos da una tranquilidad increíble durante cada sesión de entrenamiento.',
      name: 'Ana L.',
      role: 'Tutor',
      avatar: 'https://i.pravatar.cc/150?img=47'
    }
  ];
}
