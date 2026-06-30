import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/landing-header/landing-header.component';
import { FormStateService } from '../../services/form-state.service';
import { DocumentKey } from '../../../auth/models/registration.model';

@Component({
  selector: 'app-certificado',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, HeaderComponent],
  templateUrl: './certificado.component.html',
  styleUrls: ['./certificado.component.scss'],
})
export class Certificado {
  feedbackMessage = '';
  showValidationModal = false;
  missingDocuments: string[] = [];

  readonly documents = [
    { key: 'dni', title: 'DNI / Documento de identidad' },
    { key: 'titulo', title: 'Título universitario (SUNEDU)' },
    { key: 'antecedentes', title: 'Antecedentes penales' },
    { key: 'certificacion', title: 'Certificación en entrenamiento adaptado' },
  ] as const;

  constructor(
    public formState: FormStateService,
    private router: Router,
  ) { }

  get hasMissingDocuments(): boolean {
    return this.formState.getMissingDocumentFields().length > 0;
  }

  // Activa el input file dinámico
  triggerFileInput(key: string): void {
    const fileInput = document.getElementById(`file-${key}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

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
      this.feedbackMessage = '';
      this.missingDocuments = missing;
      this.showValidationModal = true;
      return;
    }

    console.log('Enviando certificados reactivos:', this.formState.state.documents);
    this.feedbackMessage = '';
    this.router.navigate(['/cuenta']);
  }

  closeValidationModal(): void {
    this.showValidationModal = false;
    this.missingDocuments = [];
  }
}
