import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { SedeRequest, SedeResponse } from '../../models/sede.model';
import { SedeService } from '../../services/sede.service';
import { AuthApiService } from '../../../../core/services/auth-api.service';
import { Location as LocationService } from '../../../../shared/services/location.service';

import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FileService } from '../../../../core/services/file.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sede',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.scss'],
})
export class Sede implements OnInit, OnDestroy {
  private sedeService = inject(SedeService);
  private authApiService = inject(AuthApiService);
  private locationService = inject(LocationService);
  private fileService = inject(FileService);
  private fb = inject(FormBuilder);

  private carouselInterval: any;
  sedeFormGroup!: FormGroup;

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
  modalExitoAbierto = false;

  mensajeInfo = '';
  mensajeError = '';
  mensajeErrorModal = '';

  intentoEnviar = false;

  ngOnInit(): void {
    this.inicializarFormulario();
    
    const user = this.authApiService.getSesionActiva()?.usuario;
    this.idInstructor = user?.idInstructor ?? null;

    if (!this.idInstructor) {
      this.mensajeError = 'No se encontró el instructor asociado a la sesión actual.';
      return;
    }

    this.cargarSedes();
    this.cargarDistritos();
    this.iniciarCarrusel();
  }

  private inicializarFormulario(): void {
    this.sedeFormGroup = this.fb.group({
      zonaSede: ['', Validators.required],
      nombreSede: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,-]+$/)
        ]
      ],
      distritoSede: ['', Validators.required],
      direccionSede: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(150),
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9#./,\-\s]+$/)
        ]
      ],
      descripcionSede: [
        '',
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern(/^[\p{L}\p{N}\s.,;:()\-]+$/u)
        ]
      ]
    });
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
    this.sedeFormGroup.reset();
    this.mensajeError = '';
    this.mensajeErrorModal = '';
    this.intentoEnviar = false;
    this.nombresImagenes = '';
    this.archivosSeleccionados = [];
    this.archivosConPreview.forEach(a => URL.revokeObjectURL(a.url));
    this.archivosConPreview = [];
    this.modalAbierto = true;
  }

  cerrarModal(): void { this.modalAbierto = false; this.modalExitoAbierto = false; }

  async guardarSede(): Promise<void> {
    if (!this.idInstructor) { 
      this.mensajeErrorModal = 'No se encontró el instructor asociado a la sesión actual.'; 
      return; 
    }

    this.intentoEnviar = true;

    if (this.sedeFormGroup.invalid) {
      this.mensajeErrorModal = 'Corrige los campos marcados en rojo.'; 
      return;
    }

    if (this.archivosSeleccionados.length !== 3) { 
      this.mensajeErrorModal = 'Debes tener exactamente 3 imágenes aprobadas.'; 
      return; 
    }

    this.guardando = true;
    this.mensajeErrorModal = '';

    try {
      const urls: string[] = [];
      for (const file of this.archivosSeleccionados) {
        const response = await firstValueFrom(this.fileService.uploadImage(file));
        urls.push(response.url);
      }

      const formValue = this.sedeFormGroup.value;
      const request: SedeRequest = {
        idInstructor: this.idInstructor,
        zonaSede: formValue.zonaSede,
        nombreSede: formValue.nombreSede,
        distritoSede: formValue.distritoSede,
        direccionSede: formValue.direccionSede,
        descripcionSede: formValue.descripcionSede,
        estadoActivacion: true,
        urlImagenSede1: urls[0] ?? '',
        urlImagenSede2: urls[1] ?? '',
        urlImagenSede3: urls[2] ?? '',
      };

      await firstValueFrom(this.sedeService.crearSede(request));
      this.modalExitoAbierto = true;
      setTimeout(() => {
        this.modalExitoAbierto = false;
        this.cerrarModal();
        this.cargarSedes();
      }, 3000);
    } catch (error: any) {
      console.error(error);
      const mensajeBackend = error?.error?.message || error?.message || 'No se pudo registrar la sede.';
      this.mensajeErrorModal = mensajeBackend;
      this.mensajeError = mensajeBackend;
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

  get nombreSede() {
    return this.sedeFormGroup.get('nombreSede');
  }

  get direccionSede() {
    return this.sedeFormGroup.get('direccionSede');
  }

  get descripcionSede() {
    return this.sedeFormGroup.get('descripcionSede');
  }

  get zonaSede() {
    return this.sedeFormGroup.get('zonaSede');
  }

  get distritoSede() {
    return this.sedeFormGroup.get('distritoSede');
  }

  obtenerMensajeErrorNombre(): string {
    const control = this.nombreSede;
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'El nombre de la sede es requerido';
    if (control.errors['minlength']) return 'El nombre debe tener al menos 3 caracteres';
    if (control.errors['maxlength']) return 'El nombre no puede exceder 100 caracteres';
    if (control.errors['pattern']) return 'Permitidos: letras, números, espacios, puntos, comas y guiones';
    return '';
  }

  obtenerMensajeErrorDireccion(): string {
    const control = this.direccionSede;
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'La dirección es requerida';
    if (control.errors['minlength']) return 'La dirección debe tener al menos 5 caracteres';
    if (control.errors['maxlength']) return 'La dirección no puede exceder 150 caracteres';
    if (control.errors['pattern']) return 'Caracteres permitidos: letras, números, espacios y #, ., ,, -, /';
    return '';
  }

  obtenerMensajeErrorDescripcion(): string {
    const control = this.descripcionSede;
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'La descripción es requerida';
    if (control.errors['maxlength']) return 'La descripción no puede exceder 40 caracteres';
    if (control.errors['pattern']) return 'La descripción contiene caracteres no permitidos';
    return '';
  }

  formularioValido(): boolean {
    return this.sedeFormGroup.valid && this.archivosSeleccionados.length === 3;
  }

  campoInvalido(campo: string): boolean {
    const control = this.sedeFormGroup.get(campo);
    return Boolean(control && control.invalid && (control.dirty || control.touched || this.intentoEnviar));
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

  get caracteresDescripcion(): number {
    const valor = this.descripcionSede?.value ?? '';
    return valor.trim().length;
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
          this.archivosConPreview.push({ file, url, estado: 'aceptado' });
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
