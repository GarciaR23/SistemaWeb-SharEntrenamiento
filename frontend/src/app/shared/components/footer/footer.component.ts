import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterInfoDialogComponent, FooterDialogData } from './dialogs/footer-info-dialog.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FooterInfoDialogComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  activeInfo: FooterDialogData | null = null;

  openInfoDialog(option: 'how-it-works' | 'instructors' | 'security' | 'pricing'): void {
    this.activeInfo = this.getDialogData(option);
  }

  closeDialog(): void {
    this.activeInfo = null;
  }

  private getDialogData(option: 'how-it-works' | 'instructors' | 'security' | 'pricing'): FooterDialogData {
    switch (option) {
      case 'how-it-works':
        return {
          icon: '🔎',
          title: '¿Cómo funciona?',
          description:
            'SharEntrenamiento conecta tutores e instructores especializados en actividades físicas adaptadas. Registra tu cuenta, encuentra al instructor adecuado, programa sesiones y realiza un seguimiento del progreso de manera segura.'
        };
      case 'instructors':
        return {
          icon: '👥',
          title: 'Instructores',
          description:
            'Contamos con instructores especializados en actividades físicas adaptadas para personas con Trastorno del Espectro Autista (TEA), comprometidos con brindar una atención personalizada y un entorno de aprendizaje seguro.'
        };
      case 'security':
        return {
          icon: '🛡️',
          title: 'Seguridad',
          description:
            'Protegemos tu información mediante autenticación segura, cifrado de contraseñas y control de acceso basado en roles, garantizando la privacidad y confidencialidad de los datos.'
        };
      case 'pricing':
        return {
          icon: '💳',
          title: 'Precios',
          description:
            'Explora los planes disponibles y elige la opción que mejor se adapte a tus necesidades. Próximamente estarán disponibles diferentes alternativas para tutores e instructores.'
        };
    }
  }
}

