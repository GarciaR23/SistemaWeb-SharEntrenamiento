export type DocumentKey = 'certificacion' | 'dni' | 'titulo' | 'antecedentes';
export type ShiftName = 'Mañana' | 'Tarde' | 'Noche';
export type DayCode = 'L' | 'M' | 'Mi' | 'J' | 'V' | 'S' | 'D';

export interface ShiftSchedule {
  shift: ShiftName;
  fromTime: string;
  toTime: string;
}

export interface RegistrationDocumentState {
  file: File | null;
  fileName: string;
  status: 'PENDIENTE' | 'ENTREGADO';
}

export interface ProfileState {
  fullName: string;
  specialty: string;
  district: string;
  address: string;
  rate: string;
  selectedShifts: ShiftName[];
  selectedDays: DayCode[];
  shiftSchedules: ShiftSchedule[];
  fromTime: string;
  toTime: string;
  bio: string;
  email: string;
  password: string;
}

export interface RegistrationState {
  profile: ProfileState;
  documents: Record<DocumentKey, RegistrationDocumentState>;
}
