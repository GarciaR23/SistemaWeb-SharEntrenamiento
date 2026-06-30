import { Component, inject } from '@angular/core';
import { SedeRequest, SedeResponse } from '../../models/sede.model';
import { SedeService } from '../../services/sede.service';
import { AuthApiService } from '../../../../core/services/auth-api.service';
import { Location as LocationService } from '../../../../shared/services/location.service';

import { FormsModule } from '@angular/forms';
import { FileService } from '../../../../core/services/file.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-sede',
  imports: [FormsModule],
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.scss'],
})
export class Sede {
  private sedeService = inject(SedeService);
  private authApiService = inject(AuthApiService);
  private locationService = inject(LocationService);
  private fileService = inject(FileService);

  sedes: SedeResponse[] = [];
  distritos: string[] = [];

  idInstructor: number | null = null;

  busqueda = '';
  distritoFiltro = '';

  cargando = false;
  guardando = false;
  modalAbierto = false;

  mensajeInfo = '';
  mensajeError = '';

  nuevaSede: SedeRequest = this.obtenerFormularioInicial();

  ngOnInit(): void {
    this.idInstructor = this.authApiService.getIdInstructorLogueado();

    if (!this.idInstructor) {
      this.mensajeError = 'No se encontró el instructor asociado a la sesión actual.';
      return;
    }

    this.nuevaSede = this.obtenerFormularioInicial();
    this.cargarSedes();
    this.cargarDistritos();
  }

  distritosFallback: string[] = [
    'Ate',
    'Barranco',
    'Breña',
    'Callao',
    'Chorrillos',
    'Comas',
    'Jesús María',
    'La Molina',
    'La Victoria',
    'Lince',
    'Los Olivos',
    'Miraflores',
    'Pueblo Libre',
    'San Borja',
    'San Isidro',
    'San Juan de Lurigancho',
    'San Juan de Miraflores',
    'San Luis',
    'San Martín de Porres',
    'San Miguel',
    'Santa Anita',
    'Santiago de Surco',
    'Surquillo',
    'Villa El Salvador',
    'Villa María del Triunfo',
  ];

  cargarDistritos(): void {
    this.locationService.getDistrictsByUbigeoPrefix('1401').subscribe({
      next: (list) => {
        if (list && list.length) {
          this.distritos = [...new Set(list.map((d) => d.district))].sort((a, b) =>
            a.localeCompare(b),
          );
        } else {
          this.distritos = [...this.distritosFallback];
        }
      },
      error: () => {
        this.distritos = [...this.distritosFallback];
      },
    });
  }

  cargarSedes(): void {
    if (!this.idInstructor) return;

    this.cargando = true;
    this.mensajeError = '';

    this.sedeService.listarPorInstructor(this.idInstructor).subscribe({
      next: (sedes) => {
        this.sedes = sedes;
        this.actualizarMensajeInicial();
        this.cargando = false;
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
    this.nombresImagenes = '';
    this.archivosSeleccionados = [];
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  async guardarSede(): Promise<void> {
    if (!this.idInstructor) {
      this.mensajeError = 'No se encontró el instructor asociado a la sesión actual.';
      return;
    }

    if (
      !this.nuevaSede.distritoSede.trim() ||
      !this.nuevaSede.direccionSede.trim() ||
      !this.nuevaSede.descripcionSede.trim()
    ) {
      this.mensajeError = 'Completa distrito, dirección y descripción.';
      return;
    }

    if (this.archivosSeleccionados.length === 0) {
      this.mensajeError = 'Debes seleccionar al menos una imagen.';
      return;
    }

    this.guardando = true;
    this.mensajeError = '';

    try {
      const urls: string[] = [];

      for (const file of this.archivosSeleccionados) {
        const response = await firstValueFrom(this.fileService.uploadImage(file));

        urls.push(response.url);
      }

      const request: SedeRequest = {
        idInstructor: this.idInstructor,
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
      next: (sedeActualizada) => {
        sede.estadoActivacion = sedeActualizada.estadoActivacion;
      },
      error: () => {
        this.mensajeError = 'No se pudo actualizar el estado de la sede.';
      },
    });
  }

  filtrar(): void {
    if (!this.idInstructor) return;

    const texto = this.busqueda.trim();

    if (!texto && !this.distritoFiltro) {
      this.cargarSedes();
      return;
    }

    if (this.distritoFiltro) {
      this.sedeService.buscarPorDistrito(this.idInstructor, this.distritoFiltro).subscribe({
        next: (sedes) => {
          this.sedes = sedes;
        },
        error: () => {
          this.mensajeError = 'No se pudo filtrar por distrito.';
        },
      });

      return;
    }

    this.sedeService.buscarPorDireccion(this.idInstructor, texto).subscribe({
      next: (sedes) => {
        this.sedes = sedes;
      },
      error: () => {
        this.mensajeError = 'No se pudo realizar la búsqueda.';
      },
    });
  }

  formularioValido(): boolean {
    return Boolean(
      this.nuevaSede.distritoSede.trim() &&
      this.nuevaSede.direccionSede.trim() &&
      this.nuevaSede.descripcionSede.trim() &&
      this.archivosSeleccionados.length > 0,
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
    event.stopPropagation(); // Evitar que el clic se propague si la card tiene otros clics
    this.indicesImagenes[sede.idSede] = index;
  }

  obtenerIndiceImagen(sede: SedeResponse): number {
    return this.indicesImagenes[sede.idSede] || 0;
  }

  private obtenerFormularioInicial(): SedeRequest {
    return {
      idInstructor: this.idInstructor ?? 0,
      urlImagenSede1: '',
      urlImagenSede2: '',
      urlImagenSede3: '',
      descripcionSede: '',
      direccionSede: '',
      distritoSede: '',
      estadoActivacion: true,
    };
  }

  private actualizarMensajeInicial(): void {
    if (this.sedes.length === 0) {
      this.mensajeInfo =
        'Aún no existen sedes registradas. Debes configurar al menos tres sedes para aparecer en el catálogo de instructores.';
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

  onImagenesSedeChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return; // No borrar lo que ya estaba si cancelan el selector
    }

    const archivosNuevos = Array.from(input.files);

    const imagenesValidas = archivosNuevos.filter((file) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    );

    if (imagenesValidas.length !== archivosNuevos.length) {
      this.mensajeError = 'Solo se permiten imágenes JPG, PNG o WEBP.';
    }

    for (const file of imagenesValidas) {
      if (this.archivosSeleccionados.length < 3) {
        // Evitar agregar la misma imagen repetida
        if (!this.archivosSeleccionados.some(f => f.name === file.name)) {
          this.archivosSeleccionados.push(file);
        }
      } else {
        this.mensajeError = 'Solo puedes subir máximo 3 imágenes.';
        break;
      }
    }

    this.nombresImagenes = this.archivosSeleccionados.map((file) => file.name).join(', ');

    // Limpiar el input para permitir seleccionar más imágenes en otro clic
    input.value = '';
  }
}
