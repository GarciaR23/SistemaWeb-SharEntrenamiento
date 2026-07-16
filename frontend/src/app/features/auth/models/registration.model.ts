import { ProfileState } from "../../instructor/models/perfil.model";

export type DocumentKey = 'certificacion' | 'dni' | 'titulo' | 'antecedentes';

export interface RegistrationDocumentState {
  file: File | null;
  fileName: string;
  status: 'PENDIENTE' | 'ENTREGADO';
}

export interface RegistrationState {
  profile: ProfileState & { email: string; password: string };
  documents: Record<DocumentKey, RegistrationDocumentState>;
}
