import { DocumentoDto } from "./documento.model";

export interface RevisionDocumentoResponse {
    idInstructor: number;
    documentos: DocumentoDto[];
}