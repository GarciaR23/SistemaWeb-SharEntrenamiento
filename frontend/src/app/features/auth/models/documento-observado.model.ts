export interface DocumentoObservado {
  idDocumento: number;
  nombreDocumento: string;
  urlArchivo: string;
  estadoAprobacion: string;
  comentarioAdmin: string;
  fechaRespuesta: string;

  archivoCorregido?: File | null;
  corregido?: boolean;
}
