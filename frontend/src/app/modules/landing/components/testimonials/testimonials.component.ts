import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent {

  testimonials = [
    {
      text: 'La conexión con el instructor fue inmediata. El enfoque adaptado ha permitido que mi hijo disfrute del deporte sin barreras.',
      name: 'María García',
      role: 'Madre de familia'
    },
    {
      text: 'Como instructor certificado, esta plataforma me permite llegar a quienes más necesitan un entrenamiento especializado y seguro.',
      name: 'Carlos Ruiz',
      role: 'Instructor Certificado'
    },
    {
      text: 'El sistema de monitoreo en tiempo real nos da una tranquilidad increíble durante cada sesión de entrenamiento.',
      name: 'Ana L.',
      role: 'Tutor'
    }
  ];
}