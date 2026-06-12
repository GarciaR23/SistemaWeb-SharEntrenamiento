import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentoDto, RevisionDocumentoService } from '../../services/revision-documento.service';
import { RespuestaDocumentoService } from '../../services/respuesta-documento.service';
import { HistorialRespuestaService } from '../../services/historial-respuesta.service';
import { AuthApiService } from '../../../../core/services/auth-api.service';

interface HistorialRechazo {
  fecha: string;
  comentario: string;
}

interface DocumentoRevision extends DocumentoDto {
  revisado?: boolean;
}

@Component({
  selector: 'app-revision-documento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './revision-documento.component.html',
  styleUrls: ['./revision-documento.component.scss']
})
export class RevisionDocumento {
  isRevisionModalOpen: boolean = false;
  showRechazoModal: boolean = false;
  comentarioRechazo: string = '';
  docARechazar: DocumentoDto | null = null;

  nombreInstructorModal: string = '';
  idInstructorActual!: number;
  listaDocumentosRevision: DocumentoRevision[] = [];
  historialRechazos: HistorialRechazo[] = [];
  confirmApproveModalOpen = false;
  documentoAprobar: DocumentoRevision | null = null;

  constructor(
    private readonly revisionService: RevisionDocumentoService,
    private readonly respuestaService: RespuestaDocumentoService,
    private readonly historialService: HistorialRespuestaService,
    private readonly authService: AuthApiService
  ) { }

  activarRevisionDocumento(idInstructor: number, nombreCompleto: string): void {
    this.idInstructorActual = idInstructor;
    this.nombreInstructorModal = nombreCompleto;
    this.revisionService.obtenerRevisionPorInstructorId(idInstructor).subscribe({
      next: (response: { documentos: DocumentoDto[] }) => {
        this.listaDocumentosRevision = response.documentos.map(doc => ({ ...doc, revisado: false }));
        this.isRevisionModalOpen = true;
      },
      error: (err: any) => console.error('Error al recuperar documentos:', err)
    });
  }

  marcarEstadoDocumento(documento: DocumentoRevision, estado: string): void {
    if (estado === 'aprobado') {
      this.documentoAprobar = documento;
      this.confirmApproveModalOpen = true;
      return;
    }

    this.docARechazar = documento;
    this.comentarioRechazo = '';
    this.cargarHistorialDocumento(documento.idDocumento);
    this.showRechazoModal = true;
  }

  confirmarAprobacion(): void {
    if (!this.documentoAprobar) {
      return;
    }
    this.enviarEvaluacion(this.documentoAprobar, 'aprobado', '');
    this.confirmApproveModalOpen = false;
    this.documentoAprobar = null;
  }

  private cargarHistorialDocumento(idDocumento: number): void {
    this.historialService.obtenerHistorialRechazosPorDocumento(idDocumento).subscribe({
      next: (historial: { comentario: string; fecha: string }[]) => {
        this.historialRechazos = historial.map(item => ({
          fecha: this.formatearFecha(item.fecha),
          comentario: item.comentario
        }));
      },
      error: (err: any) => {
        console.error('Error al cargar historial del documento:', err);
        this.historialRechazos = []; 
      }
    });
  }

  private formatearFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear().toString().slice(-2);
    return `${dia}/${mes}/${anio}`;
  }

  confirmarRechazo(): void {
    if (this.docARechazar && this.comentarioRechazo.trim()) {
      this.enviarEvaluacion(this.docARechazar, 'rechazado', this.comentarioRechazo);
    }
  }

  private enviarEvaluacion(doc: DocumentoRevision, estado: string, comentario: string): void {
    const usuario = this.authService.getUsuarioLogueado();
    const idAdmin = usuario ? usuario.idUsuario : 0;

    this.respuestaService.evaluarDocumento(this.idInstructorActual, doc.idDocumento, estado, idAdmin, comentario)
      .subscribe({
        next: () => {
          doc.estadoAprobacion = estado;
          if (estado === 'aprobado') {
            doc.revisado = true;
          }

          this.showRechazoModal = false;
          this.comentarioRechazo = '';
          this.docARechazar = null;
        },
        error: (err) => console.error('Error al enviar evaluación:', err)
      });
  }

  cerrarRevisionModal(): void {
    this.isRevisionModalOpen = false;
    this.listaDocumentosRevision = [];
    this.historialRechazos = [];
  }

  verDocumentoUrl(doc: DocumentoRevision): void {
    if (doc.urlArchivo) {
      doc.revisado = true;
      window.open(doc.urlArchivo, '_blank');
    }
  }

  get todosAprobados(): boolean {
    return this.listaDocumentosRevision.length > 0 &&
      this.listaDocumentosRevision.every(d => d.estadoAprobacion === 'aprobado');
  }
}


