import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './benefits.component.html',
  styleUrl: './benefits.component.css'
})
export class BenefitsComponent {
  certifications = [
    { title: 'Verificado por SUNEDU', desc: 'Validación académica de todo nuestro staff técnico.', icon: 'school' },
    { title: 'Verificación Estricta', desc: 'Verificación estricta de antecedentes penales y policiales.', icon: 'security' },
    { title: 'Algoritmo Sensorial', desc: 'Emparejamiento basado en datos y perfiles neuro-cognitivos.', icon: 'code' },
    { title: 'Certificados Neurodivergente', desc: 'Protocolos de fisiología adaptada certificados por expertos.', icon: 'add_moderator' }
  ];

  negativePoints = [
    'Aislamiento social y falta de actividad.',
    'Riesgo de lesiones por mala praxis.',
    'Estancamiento en el desarrollo motor.',
    'Estrés familiar por falta de opciones.'
  ];

  positivePoints = [
    'Integración real en la comunidad deportiva.',
    'Mejora medible en coordinación y fuerza.',
    'Autonomía y confianza personal.',
    'Tranquilidad total para el entorno familiar.'
  ];
}
