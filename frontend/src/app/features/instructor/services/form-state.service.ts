import { Injectable } from '@angular/core';
import { DocumentKey, ProfileState, RegistrationDocumentState, RegistrationState } from '../../auth/modules/dtos/registration.models';

export type { DocumentKey, ProfileState, RegistrationDocumentState, RegistrationState } from '../../auth/modules/dtos/registration.models';

@Injectable({
  providedIn: 'root',
})
export class FormStateService {
  state: RegistrationState = {
    profile: {
      fullName: '',
      specialty: '',
      district: '',
      address: '',
      rate: '',
      selectedShift: [],
      selectedDay: ['L'],
      fromTime: '08:00',
      toTime: '17:00',
      bio: '',
      email: '',
      password: '',
    },
    documents: {
      certificacion: {
        file: null,
        fileName: '',
        status: 'PENDIENTE',
      },
      dni: {
        file: null,
        fileName: '',
        status: 'PENDIENTE',
      },
      titulo: {
        file: null,
        fileName: '',
        status: 'PENDIENTE',
      },
      antecedentes: {
        file: null,
        fileName: '',
        status: 'PENDIENTE',
      },
    },
  };

  updateDocument(key: DocumentKey, file: File | null) {
    this.state.documents[key] = {
      file,
      fileName: file?.name ?? '',
      status: file ? 'ENTREGADO' : 'PENDIENTE',
    };
  }

  getMissingProfileFields(): string[] {
    const profile = this.state.profile;
    const missing: string[] = [];

    if (!profile.fullName.trim()) missing.push('Nombre completo');
    if (!profile.specialty.trim()) missing.push('Especialidad');
    if (!profile.district.trim()) missing.push('Distrito');
    if (!profile.address.trim()) missing.push('Dirección');
    if (!profile.rate.trim()) missing.push('Tarifa por hora');
    if (!profile.selectedShift.length) missing.push('Horario disponible');
    if (!profile.selectedDay.length) missing.push('Días disponibles');
    if (!profile.fromTime.trim()) missing.push('Hora desde');
    if (!profile.toTime.trim()) missing.push('Hora hasta');
    if (!profile.bio.trim()) missing.push('Biografía profesional');

    return missing;
  }

  getMissingDocumentFields(): string[] {
    const labels: Record<DocumentKey, string> = {
      certificacion: 'Certificación en entrenamiento adaptado',
      dni: 'DNI / Documento de identidad',
      titulo: 'Título universitario (SUNEDU)',
      antecedentes: 'Antecedentes penales',
    };

    return (Object.keys(this.state.documents) as DocumentKey[])
      .filter((key) => !this.state.documents[key].file)
      .map((key) => labels[key]);
  }

  getMissingAccountFields(): string[] {
    const profile = this.state.profile;
    const missing: string[] = [];

    if (!profile.email.trim()) missing.push('Correo electrónico');
    if (!profile.password.trim()) missing.push('Contraseña');

    return missing;
  }

  getMissingRegistrationFields(): string[] {
    return [
      ...this.getMissingProfileFields(),
      ...this.getMissingDocumentFields(),
      ...this.getMissingAccountFields(),
    ];
  }

  buildRegistrationPayload() {
    return {
      profile: { ...this.state.profile },
      documents: Object.fromEntries(
        Object.entries(this.state.documents).map(([key, value]) => [
          key,
          {
            fileName: value.fileName,
            status: value.status,
          },
        ]),
      ),
    };
  }

  resetRegistration() {
    this.state = {
      profile: {
        fullName: '',
        specialty: '',
        district: '',
        address: '',
        rate: '',
        selectedShift: [],
        selectedDay: ['L'],
        fromTime: '08:00',
        toTime: '17:00',
        bio: '',
        email: '',
        password: '',
        profileImageFile: null,
      },
      documents: {
        certificacion: { file: null, fileName: '', status: 'PENDIENTE' },
        dni: { file: null, fileName: '', status: 'PENDIENTE' },
        titulo: { file: null, fileName: '', status: 'PENDIENTE' },
        antecedentes: { file: null, fileName: '', status: 'PENDIENTE' },
      },
    };
  }
}
