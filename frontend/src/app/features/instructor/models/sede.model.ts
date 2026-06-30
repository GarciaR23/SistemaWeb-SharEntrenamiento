export interface SedeResponse {
  idSede: number;
  idInstructor: number;
  urlImagenSede1: string;
  urlImagenSede2: string | null;
  urlImagenSede3: string | null;
  descripcionSede: string;
  direccionSede: string;
  distritoSede: string;
  estadoActivacion: boolean;
  nombreCard?: string;
  imagenes?: string[];
  etiqueta?: string;
}

export interface SedeRequest {
  idInstructor: number;
  urlImagenSede1: string;
  urlImagenSede2: string | null;
  urlImagenSede3: string | null;
  descripcionSede: string;
  direccionSede: string;
  distritoSede: string;
  estadoActivacion: boolean;
}
