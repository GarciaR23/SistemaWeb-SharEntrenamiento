import { Component } from '@angular/core';

@Component({
  selector: 'app-community',
  standalone: true,
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent {
  benefits: string[] = [
    'Acceso a red de Instructores Certificados',
    'Perfil Sensorial Digital Personalizado',
    'Seguro de Accidentes Integrado',
    'Reportes de Progreso Bi-semanales'
  ];
}