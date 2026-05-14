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

  readonly documents = [
    { key: 'dni', title: 'DNI / Documento de identidad' },
    { key: 'titulo', title: 'Título universitario (SUNEDU)' },
    { key: 'antecedentes', title: 'Antecedentes penales' },
    { key: 'certificacion', title: 'Certificación en entrenamiento adaptado' },
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
      console.warn(this.feedbackMessage);
      return;
    }

    console.log('Enviando certificados reactivos:', this.formState.state.documents);
    this.feedbackMessage = '';
    this.router.navigate(['/cuenta']);
  }
}
