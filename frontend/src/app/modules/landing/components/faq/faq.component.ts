import { Component } from '@angular/core';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {

  faqs: FaqItem[] = [
    {
      question: '¿Cómo garantizan la seguridad de mi hijo?',
      answer: 'Contamos con instructores certificados y protocolos de seguridad validados.'
    },
    {
      question: '¿Qué es el Perfil Sensorial?',
      answer: 'Es una evaluación digital para adaptar el entrenamiento a cada persona.'
    },
    {
      question: '¿Cuál es el costo del servicio?',
      answer: 'Depende del plan mensual y la frecuencia de sesiones.'
    }
  ];

  selectedFaq: FaqItem | null = null;

  openFaq(item: FaqItem) {
    this.selectedFaq = item;
  }

  closeFaq() {
    this.selectedFaq = null;
  }
}