import { Component, EventEmitter, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HistorialRespuestaService } from '../../services/historial-respuesta.service';
import { AuthApiService } from '../../../../core/services/auth-api.service';
import { DocumentoDto } from '../../models/documento.model';
import { RevisionDocumentoService } from '../../services/revision-documento.service';

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
  imports: [FormsModule],
  templateUrl: './revision-documento.component.html',
  styleUrls: ['./revision-documento.component.scss']
})
export class RevisionDocumento {
  @Output() solicitudCompletada = new EventEmitter<number>();

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
  infoModalOpen = false;
  infoModalTitulo = '';
  infoModalMensaje = '';
  showEnvioFinalModal = false;
  showEnvioExitosoModal = false;

  private documentosRevisados: Set<number> = new Set();

  constructor(
    private readonly revisionService: RevisionDocumentoService,
    private readonly historialService: HistorialRespuestaService,
    private readonly authService: AuthApiService
  ) { }

  activarRevisionDocumento(idInstructor: number, nombreCompleto: string): void {
    this.idInstructorActual = idInstructor;
    this.nombreInstructorModal = nombreCompleto;
    this.revisionService.obtenerRevisionPorInstructorId(idInstructor).subscribe({
      next: (response: { documentos: DocumentoDto[] }) => {
        this.listaDocumentosRevision = response.documentos.map(doc => ({
          ...doc,
          revisado: this.documentosRevisados.has(doc.idDocumento)
        }));
        this.isRevisionModalOpen = true;
      },
      error: (err: any) => console.error('Error al recuperar documentos:', err)
    });
  }

  marcarEstadoDocumento(documento: DocumentoRevision, estado: string): void {
    if (estado === 'aprobado') {
      if (documento.estadoAprobacion === 'aprobado') {
        this.infoModalTitulo = 'Documento ya aprobado';
        this.infoModalMensaje = 'Ya aprobó este documento.';
        this.infoModalOpen = true;
        return;
      }
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
    if (!this.documentoAprobar) return;
    this.enviarEvaluacion(this.documentoAprobar, 'aprobado', '');
    this.confirmApproveModalOpen = false;
    this.documentoAprobar = null;
  }

  cerrarInfoModal(): void {
    this.infoModalOpen = false;
  }

  private cargarHistorialDocumento(idDocumento: number): void {
    this.historialService.obtenerHistorialRechazosPorDocumento(idDocumento).subscribe({
      next: (historial: { comentario: string; fecha: string }[]) => {
        this.historialRechazos = historial.map(item => ({
          fecha: this.formatearFecha(item.fecha),
          comentario: item.comentario
        }));
      },
      error: () => { this.historialRechazos = []; }
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

    this.historialService.evaluarDocumento(this.idInstructorActual, doc.idDocumento, estado, idAdmin, comentario)
      .subscribe({
        next: () => {
          doc.estadoAprobacion = estado;
          if (estado === 'aprobado') {
            doc.revisado = true;
            this.documentosRevisados.add(doc.idDocumento);
          }
          this.showRechazoModal = false;
          this.comentarioRechazo = '';
          this.docARechazar = null;
        },
        error: (err) => console.error('Error al enviar evaluación:', err)
      });
  }

  siguiente(): void {
    if (!this.todosRevisados) {
      this.cerrarRevisionModal();
      return;
    }

    this.showEnvioFinalModal = true;
  }

  confirmarEnvioFinal(): void {
    this.historialService.finalizarRevision(this.idInstructorActual).subscribe({
      next: () => {
        this.showEnvioFinalModal = false;
        this.showEnvioExitosoModal = true;
      },
      error: (err) => {
        console.error('Error al finalizar revisión:', err);
        this.showEnvioFinalModal = false;
        this.showEnvioExitosoModal = true; // Para que no se trabe
      }
    });
  }

  cerrarEnvioExitoso(): void {
    this.showEnvioExitosoModal = false;
    this.solicitudCompletada.emit(this.idInstructorActual);
    this.cerrarRevisionModal();
  }

  cerrarRevisionModal(): void {
    this.isRevisionModalOpen = false;
    this.listaDocumentosRevision = [];
    this.historialRechazos = [];
  }

  verDocumentoUrl(doc: DocumentoRevision): void {
    if (doc.urlArchivo) {
      doc.revisado = true;
      this.documentosRevisados.add(doc.idDocumento);
      window.open(doc.urlArchivo, '_blank');
    }
  }

  get todosRevisados(): boolean {
    return this.listaDocumentosRevision.length > 0 &&
      this.listaDocumentosRevision.every(d => d.estadoAprobacion !== 'pendiente');
  }
}
