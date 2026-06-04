import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentoDto, RevisionDocumentoService } from '../../../services/revision-documento.service';
import { RespuestaDocumentoService } from '../../../services/respuesta-documento.service';
import { HistorialRespuestaService } from '../../../services/historial-respuesta.service';
import { AuthApiService } from '../../../services/auth-api.service';

interface HistorialRechazo {
  fecha: string;
  comentario: string;
}

@Component({
  selector: 'app-revision-documento',
  imports: [CommonModule, FormsModule],
  templateUrl: './revision-documento.html',
  styleUrls: ['./revision-documento.css']
})
export class RevisionDocumento {
  isRevisionModalOpen: boolean = false;
  showRechazoModal: boolean = false;
  comentarioRechazo: string = '';
  docARechazar: DocumentoDto | null = null;

  nombreInstructorModal: string = '';
  idInstructorActual!: number;
  listaDocumentosRevision: DocumentoDto[] = [];
  historialRechazos: HistorialRechazo[] = [];

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
      next: (response) => {
        this.listaDocumentosRevision = response.documentos;
        this.isRevisionModalOpen = true;
      },
      error: (err) => console.error('Error al recuperar documentos:', err)
    });
  }

  marcarEstadoDocumento(documento: DocumentoDto, estado: string): void {
    if (estado === 'aprobado') {
      this.enviarEvaluacion(documento, 'aprobado', '');
    } else {
      this.docARechazar = documento;
      this.comentarioRechazo = '';
      this.cargarHistorialDocumento(documento.idDocumento); 
      this.showRechazoModal = true;
    }
  }

  private cargarHistorialDocumento(idDocumento: number): void {
    this.historialService.obtenerHistorialRechazosPorDocumento(idDocumento).subscribe({
      next: (historial) => {
        this.historialRechazos = historial.map(item => ({
          fecha: this.formatearFecha(item.fecha),
          comentario: item.comentario
        }));
      },
      error: (err) => {
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

  private enviarEvaluacion(doc: DocumentoDto, estado: string, comentario: string): void {
    const usuario = this.authService.getUsuarioLogueado();
    const idAdmin = usuario ? usuario.idUsuario : 0;

    this.respuestaService.evaluarDocumento(this.idInstructorActual, doc.idDocumento, estado, idAdmin, comentario)
      .subscribe({
        next: () => {
          doc.estadoAprobacion = estado;

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

  verDocumentoUrl(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  get todosAprobados(): boolean {
    return this.listaDocumentosRevision.length > 0 &&
      this.listaDocumentosRevision.every(d => d.estadoAprobacion === 'aprobado');
  }
}