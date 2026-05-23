import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DocumentKey, FormStateService } from '../../../services/form-state.service';

@Component({
  selector: 'app-certificado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './certificado.html',
  styleUrls: ['./certificado.scss'],
})
export class Certificado {
  feedbackMessage = '';
  showFeedbackModal = false;

  readonly documents = [
    { key: 'dni', title: 'DNI / Documento de identidad', icon: 'assets/icons/Icon_document.png' },
    { key: 'titulo', title: 'Título universitario (SUNEDU)', icon: 'assets/icons/Icon_universidad.png' },
    { key: 'antecedentes', title: 'Antecedentes penales', icon: 'assets/icons/Icon_antencedentes.png' },
    { key: 'certificacion', title: 'Certificación en entrenamiento adaptado', icon: 'assets/icons/Icon_certif_trainer.png' },
  ] as const;

  constructor(
    public formState: FormStateService,
    private router: Router,
  ) {}

  getFile(key: DocumentKey, $event: Event): void {
    const input = $event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.formState.updateDocument(key, file);
    this.feedbackMessage = '';
    this.showFeedbackModal = false;

    console.log(`Archivo recibido para ${key}:`, this.formState.state.documents[key]);
  }

  getStatusLabel(key: DocumentKey): string {
    return this.formState.state.documents[key].status;
  }

  getFileName(key: DocumentKey): string {
    return this.formState.state.documents[key].fileName;
  }

  goToCuenta(): void {
    const missing = this.formState.getMissingDocumentFields();

    if (missing.length > 0) {
      this.feedbackMessage = `Faltan documentos por subir: ${missing.join(', ')}`;
      this.showFeedbackModal = true;
      console.warn(this.feedbackMessage);
      return;
    }

    console.log('Enviando certificados reactivos:', this.formState.state.documents);
    this.feedbackMessage = '';
    this.showFeedbackModal = false;
    this.router.navigate(['/cuenta']);
  }

  closeFeedbackModal(): void {
    this.showFeedbackModal = false;
    this.feedbackMessage = '';
  }
}
