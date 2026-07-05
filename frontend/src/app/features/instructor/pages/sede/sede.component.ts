import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { SedeRequest, SedeResponse } from '../../models/sede.model';
import { SedeService } from '../../services/sede.service';
import { AuthApiService } from '../../../../core/services/auth-api.service';
import { Location as LocationService } from '../../../../shared/services/location.service';

import { FormsModule } from '@angular/forms';
import { FileService } from '../../../../core/services/file.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sede',
  imports: [FormsModule, CommonModule],
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.scss'],
})
export class Sede implements OnInit, OnDestroy {
  private sedeService = inject(SedeService);
  private authApiService = inject(AuthApiService);
  private locationService = inject(LocationService);
  private fileService = inject(FileService);

  private carouselInterval: any;

  sedes: SedeResponse[] = [];
  sedesOriginales: SedeResponse[] = [];

  zonas: string[] = ['Norte', 'Sur', 'Este', 'Oeste', 'Centro'];

  distritos: string[] = [];

  idInstructor: number | null = null;

  busqueda = '';
  distritoFiltro = '';

  cargando = false;
  guardando = false;
  modalAbierto = false;

  mensajeInfo = '';
  mensajeError = '';
  mensajeErrorModal = '';

  nuevaSede: SedeRequest = this.obtenerFormularioInicial();

  ngOnInit(): void {
    const user = this.authApiService.getSesionActiva()?.usuario;
    this.idInstructor = user?.idInstructor ?? null;

    if (!this.idInstructor) {
      this.mensajeError = 'No se encontró el instructor asociado a la sesión actual.';
      return;
    }

    this.nuevaSede = this.obtenerFormularioInicial();
    this.cargarSedes();
    this.cargarDistritos();
    this.iniciarCarrusel();
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  iniciarCarrusel(): void {
    this.carouselInterval = setInterval(() => {
      if (this.sedes && this.sedes.length > 0) {
        this.sedes.forEach(sede => {
          if (sede.imagenes && sede.imagenes.length > 1) {
            const currentIndex = this.obtenerIndiceImagen(sede);
            const nextIndex = (currentIndex + 1) % sede.imagenes.length;
            this.indicesImagenes[sede.idSede] = nextIndex;
          }
        });
      }
    }, 2000);
  }

  distritosFallback: string[] = [
    'Ate', 'Barranco', 'Breña', 'Callao', 'Chorrillos', 'Comas',
    'Jesús María', 'La Molina', 'La Victoria', 'Lince', 'Los Olivos',
    'Miraflores', 'Pueblo Libre', 'San Borja', 'San Isidro',
    'San Juan de Lurigancho', 'San Juan de Miraflores', 'San Luis',
    'San Martín de Porres', 'San Miguel', 'Santa Anita',
    'Santiago de Surco', 'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo',
  ];

  private toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
  }

  cargarDistritos(): void {
    this.locationService.getDistrictsByUbigeoPrefix('1401').subscribe({
      next: (list) => {
        if (list && list.length) {
          this.distritos = [...new Set(list.map(d => this.toTitleCase(d.district)))
          ].sort((a, b) => a.localeCompare(b));
        } else {
          this.distritos = [...this.distritosFallback];
        }
      },
      error: () => { this.distritos = [...this.distritosFallback]; },
    });
  }

  cargarSedes(): void {
    if (!this.idInstructor) return;
    this.cargando = true;
    this.mensajeError = '';
    this.sedeService.listarPorInstructor(this.idInstructor).subscribe({
      next: (sedes) => {
        this.sedesOriginales = sedes;
        this.sedes = sedes;
        this.actualizarMensajeInicial();
        this.cargando = false;
        if (this.busqueda || this.distritoFiltro) {
           this.filtrar();
        }
      },
      error: () => {
        this.mensajeError = 'No se pudieron cargar las sedes registradas.';
        this.cargando = false;
      },
    });
  }

  abrirModal(): void {
    this.nuevaSede = this.obtenerFormularioInicial();
    this.mensajeError = '';
    this.mensajeErrorModal = '';
    this.nombresImagenes = '';
    this.archivosSeleccionados = [];
    this.archivosConPreview.forEach(a => URL.revokeObjectURL(a.url));
    this.archivosConPreview = [];
    this.modalAbierto = true;
  }

  cerrarModal(): void { this.modalAbierto = false; }

  async guardarSede(): Promise<void> {
    if (!this.idInstructor) { this.mensajeErrorModal = 'No se encontró el instructor asociado a la sesión actual.'; return; }
    if (!this.nuevaSede.zonaSede.trim() || !this.nuevaSede.nombreSede.trim() || !this.nuevaSede.distritoSede.trim() || !this.nuevaSede.direccionSede.trim() || !this.nuevaSede.descripcionSede.trim()) {
      this.mensajeErrorModal = 'Completa todos los campos requeridos.'; return;
    }

    const wordCount = this.nuevaSede.descripcionSede.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 40) {
      this.mensajeErrorModal = 'La descripción de la sede debe tener al menos 40 palabras.';
      return;
    }

    if (this.archivosSeleccionados.length !== 3) { this.mensajeErrorModal = 'Debes tener exactamente 3 imágenes aprobadas.'; return; }

    this.guardando = true;
    this.mensajeErrorModal = '';

    try {
      const urls: string[] = [];
      for (const file of this.archivosSeleccionados) {
        const response = await firstValueFrom(this.fileService.uploadImage(file));
        urls.push(response.url);
      }

      const request: SedeRequest = {
        idInstructor: this.idInstructor,
        zonaSede: this.nuevaSede.zonaSede,
        nombreSede: this.nuevaSede.nombreSede,
        distritoSede: this.nuevaSede.distritoSede,
        direccionSede: this.nuevaSede.direccionSede,
        descripcionSede: this.nuevaSede.descripcionSede,
        estadoActivacion: true,
        urlImagenSede1: urls[0] ?? '',
        urlImagenSede2: urls[1] ?? '',
        urlImagenSede3: urls[2] ?? '',
      };

      await firstValueFrom(this.sedeService.crearSede(request));
      this.cerrarModal();
      this.cargarSedes();
    } catch (error) {
      console.error(error);
      this.mensajeError = 'No se pudo registrar la sede.';
    } finally {
      this.guardando = false;
    }
  }

  cambiarEstado(sede: SedeResponse): void {
    const nuevoEstado = !sede.estadoActivacion;
    this.sedeService.actualizarEstado(sede.idSede, nuevoEstado).subscribe({
      next: (sedeActualizada) => { sede.estadoActivacion = sedeActualizada.estadoActivacion; },
      error: () => { this.mensajeError = 'No se pudo actualizar el estado de la sede.'; },
    });
  }

  filtrar(): void {
    if (!this.idInstructor) return;

    const texto = this.busqueda.trim().toLowerCase();
    const distrito = this.distritoFiltro;

    this.sedes = this.sedesOriginales.filter(sede => {
      const matchTexto = texto.length === 0 ||
                         (sede.nombreCard && sede.nombreCard.toLowerCase().includes(texto)) ||
                         (sede.direccionSede && sede.direccionSede.toLowerCase().includes(texto));

      const matchDistrito = !distrito || sede.distritoSede === distrito;

      return matchTexto && matchDistrito;
    });
  }

  formularioValido(): boolean {
    return Boolean(
      this.nuevaSede.zonaSede.trim() &&
      this.nuevaSede.nombreSede.trim() &&
      this.nuevaSede.distritoSede.trim() &&
      this.nuevaSede.direccionSede.trim() &&
      this.nuevaSede.descripcionSede.trim() &&
      this.archivosSeleccionados.length === 3,
    );
  }

  indicesImagenes: Record<number, number> = {};

  imagenPrincipal(sede: SedeResponse): string {
    if (sede.imagenes && sede.imagenes.length > 0) {
      const index = this.indicesImagenes[sede.idSede] || 0;
      return sede.imagenes[index] || sede.imagenes[0];
    }
    return 'assets/images/sede-placeholder.jpg';
  }

  cambiarImagenSede(sede: SedeResponse, index: number, event: Event): void {
    event.stopPropagation();
    this.indicesImagenes[sede.idSede] = index;
  }

  obtenerIndiceImagen(sede: SedeResponse): number {
    return this.indicesImagenes[sede.idSede] || 0;
  }

  private obtenerFormularioInicial(): SedeRequest {
    return {
      idInstructor: this.idInstructor ?? 0,
      zonaSede: '', nombreSede: '',
      urlImagenSede1: '', urlImagenSede2: '', urlImagenSede3: '',
      descripcionSede: '', direccionSede: '', distritoSede: '', estadoActivacion: true,
    };
  }

  private actualizarMensajeInicial(): void {
    if (this.sedes.length === 0) {
      this.mensajeInfo = 'Aún no existen sedes registradas. Debes configurar al menos tres sedes para aparecer en el catálogo de instructores.';
      return;
    }
    if (this.sedes.length < 3) {
      this.mensajeInfo = `Tienes ${this.sedes.length} sede(s) registrada(s). Debes configurar al menos tres sedes para aparecer en el catálogo de instructores.`;
      return;
    }
    this.mensajeInfo = '';
  }

  nombresImagenes = '';
  archivosSeleccionados: File[] = [];
  archivosConPreview: { file: File, url: string, estado: 'pendiente' | 'aceptado' | 'rechazado' }[] = [];

  onImagenesSedeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const archivosNuevos = Array.from(input.files);
    const imagenesValidas = archivosNuevos.filter((file) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    );

    if (imagenesValidas.length !== archivosNuevos.length) {
      this.mensajeErrorModal = 'Solo se permiten imágenes JPG, PNG o WEBP.';
    }

    for (const file of imagenesValidas) {
      if (this.archivosConPreview.length < 3) {
        if (!this.archivosConPreview.some(f => f.file.name === file.name)) {
          const url = URL.createObjectURL(file);
          this.archivosConPreview.push({ file, url, estado: 'pendiente' });
        }
      } else {
        this.mensajeErrorModal = 'Solo puedes subir máximo 3 imágenes.';
        break;
      }
    }

    this.actualizarArchivosSeleccionados();
    input.value = '';
  }

  marcarEstadoImagen(index: number, estado: 'aceptado' | 'rechazado') {
      if (estado === 'rechazado') {
          URL.revokeObjectURL(this.archivosConPreview[index].url);
          this.archivosConPreview.splice(index, 1);
      } else {
          this.archivosConPreview[index].estado = estado;
      }
      this.actualizarArchivosSeleccionados();
  }

  // ====== Mini-panel / modal de previsualización de imágenes ======
  previewImagenAbierto = false;
  previewImagenIndex = 0;

  get previewImagenActual() {
    return this.archivosConPreview[this.previewImagenIndex] ?? null;
  }

  get previewImagenTotal(): number {
    return this.archivosConPreview.length;
  }

  get hayPreviewAnterior(): boolean {
    return this.previewImagenIndex > 0;
  }

  get hayPreviewSiguiente(): boolean {
    return this.previewImagenIndex < this.archivosConPreview.length - 1;
  }

  verImagenPreview(index: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (index < 0 || index >= this.archivosConPreview.length) return;
    this.previewImagenIndex = index;
    this.previewImagenAbierto = true;
  }

  anteriorPreview(): void {
    if (this.hayPreviewAnterior) {
      this.previewImagenIndex--;
    }
  }

  siguientePreview(): void {
    if (this.hayPreviewSiguiente) {
      this.previewImagenIndex++;
    }
  }

  cerrarPreviewImagen(): void {
    this.previewImagenAbierto = false;
  }

  @HostListener('document:keydown', ['$event'])
  manejarTecladoPreview(event: KeyboardEvent): void {
    if (!this.previewImagenAbierto) return;
    switch (event.key) {
      case 'Escape':
        this.cerrarPreviewImagen();
        break;
      case 'ArrowRight':
        this.siguientePreview();
        break;
      case 'ArrowLeft':
        this.anteriorPreview();
        break;
    }
  }

  actualizarArchivosSeleccionados() {
      this.archivosSeleccionados = this.archivosConPreview.filter(a => a.estado === 'aceptado').map(a => a.file);
      this.nombresImagenes = this.archivosSeleccionados.map((file) => file.name).join(', ');
  }
}
