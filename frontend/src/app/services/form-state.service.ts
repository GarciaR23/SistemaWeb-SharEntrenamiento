import { Injectable } from '@angular/core';
import {
  DayCode,
  DocumentKey,
  ProfileState,
  RegistrationDocumentState,
  RegistrationState,
  ShiftName,
} from '../data/registration.models';

export type { DocumentKey, ProfileState, RegistrationDocumentState, RegistrationState } from '../data/registration.models';

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
      selectedShifts: [],
      selectedDays: [],
      shiftSchedules: [],
      fromTime: '',
      toTime: '',
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
    if (!profile.selectedShifts.length) missing.push('Horario disponible');
    if (!profile.selectedDays.length) missing.push('Días disponibles');
    if (!profile.shiftSchedules.length) missing.push('Rangos de horario por turno');
    if (!profile.fromTime.trim()) missing.push('Rango horario combinado (desde)');
    if (!profile.toTime.trim()) missing.push('Rango horario combinado (hasta)');
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
        selectedShifts: [],
        selectedDays: [],
        shiftSchedules: [],
        fromTime: '',
        toTime: '',
        bio: '',
        email: '',
        password: '',
      },
      documents: {
        certificacion: { file: null, fileName: '', status: 'PENDIENTE' },
        dni: { file: null, fileName: '', status: 'PENDIENTE' },
        titulo: { file: null, fileName: '', status: 'PENDIENTE' },
        antecedentes: { file: null, fileName: '', status: 'PENDIENTE' },
      },
    };
  }

  updateScheduleSummary(): void {
    const schedules = this.state.profile.shiftSchedules;
    if (!schedules.length) {
      this.state.profile.fromTime = '';
      this.state.profile.toTime = '';
      return;
    }

    const toMinutes = (value: string): number => {
      const [h, m] = value.split(':').map(Number);
      return (h * 60) + m;
    };

    const toTime = (minutes: number): string => {
      const safeMinutes = Math.max(0, Math.min(minutes, 23 * 60 + 59));
      const hours = Math.floor(safeMinutes / 60).toString().padStart(2, '0');
      const mins = (safeMinutes % 60).toString().padStart(2, '0');
      return `${hours}:${mins}`;
    };

    const minStart = Math.min(...schedules.map((x) => toMinutes(x.fromTime)));
    const maxEnd = Math.max(...schedules.map((x) => toMinutes(x.toTime)));

    this.state.profile.fromTime = toTime(minStart);
    this.state.profile.toTime = toTime(maxEnd);
  }

  updateShiftSelection(shifts: ShiftName[], days: DayCode[]): void {
    this.state.profile.selectedShifts = shifts;
    this.state.profile.selectedDays = days;
  }
}
