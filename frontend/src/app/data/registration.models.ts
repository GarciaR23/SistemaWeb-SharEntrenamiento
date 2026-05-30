export type DocumentKey = 'certificacion' | 'dni' | 'titulo' | 'antecedentes';

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
  selectedShift: string;
  selectedDay: string;
  fromTime: string;
  toTime: string;
  bio: string;
  email: string;
  password: string;
  profileImageFile?: File | null;
}

export interface RegistrationState {
  profile: ProfileState;
  documents: Record<DocumentKey, RegistrationDocumentState>;
}
