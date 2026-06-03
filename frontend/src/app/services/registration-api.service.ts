import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { DocumentKey } from './form-state.service';
import { FileService } from './fileservice';
import { LoginResponse } from './auth-api.service';

interface InstructorResponse {
  idInstructor: number;
  idUsuario: number;
  nombreCompleto: string;
  urlImagenPerfil: string | null;
  especialidad: string;
  biografia: string;
  distrito: string;
  direccion: string;
}

interface TutorDto {
  idTutor: number | null;
  idUsuario: number;
  nombreCompleto: string;
}

interface PacienteDto {
  idPaciente: number | null;
  idTutor: number;
  nombreCompleto: string;
  urlImagenPaciente: string | null;
  condicion: string;
  gradoAutismo: string;
  genero: string;
  edad: number;
  distrito: string;
  direccion: string;
}

interface DocumentoDto {
  idDocumento: number | null;
  idInstructor: number;
  nombreDocumento: string;
  urlArchivo: string;
  estadoAprobacion: string;
  fechaSubida: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class RegistrationApiService {
  private readonly registroUrl = 'http://localhost:8080/api/auth/register';
  private readonly pacienteUrl = 'http://localhost:8080/api/pacientes';
  private readonly instructorUrl = 'http://localhost:8080/api/instructores';
  private readonly documentoUrl = 'http://localhost:8080/api/documentos';

  constructor(
    private http: HttpClient,
    private fileService: FileService,
  ) { }

  async registrarTutorConPaciente(payload: {
    tutorNombre: string;
    pacienteNombre: string;
    condicion: string;
    gradoAutismo: string;
    genero: string;
    edad: number;
    distrito: string;
    direccion: string;
    correo: string;
    clave: string;
    fotoPaciente: File | null;
  }): Promise<void> {
    let fotoUrl: string | null = null;
    if (payload.fotoPaciente) {
      const uploaded = await firstValueFrom(this.fileService.uploadImage(payload.fotoPaciente));
      fotoUrl = uploaded.url;
    }

    const registerResult = await firstValueFrom(
      this.http.post<LoginResponse>(`${this.registroUrl}/tutor`, {
        email: payload.correo,
        clave: payload.clave,
        nombreCompleto: payload.tutorNombre,
      }),
    );

    if (!registerResult.success || !registerResult.usuario) {
      throw new Error(registerResult.message || 'No se pudo registrar');
    }

    const tutores = await firstValueFrom(
      this.http.get<TutorDto[]>(`http://localhost:8080/api/tutores`)
    );
    const tutor = tutores.find(t => t.idUsuario === registerResult.usuario!.idUsuario);
    if (!tutor) {
      throw new Error('No se encontró el tutor creado');
    }

    await firstValueFrom(
      this.http.post<PacienteDto>(this.pacienteUrl, {
        idPaciente: null,
        idTutor: tutor.idTutor,
        nombreCompleto: payload.pacienteNombre,
        urlImagenPaciente: fotoUrl,
        condicion: payload.condicion,
        gradoAutismo: payload.gradoAutismo.toLowerCase(),
        genero: payload.genero.toLowerCase(),
        edad: payload.edad,
        distrito: payload.distrito,
        direccion: payload.direccion,
      }),
    );
  }

  async registrarInstructorConDocumentos(payload: {
    nombreCompleto: string;
    especialidad: string;
    biografia: string;
    distrito: string;
    direccion: string;
    profileImageFile?: File | null;
    email: string;
    clave: string;
    documentos: Record<DocumentKey, File | null>;
  }): Promise<void> {
    let urlImagenPerfil: string | null = null;
    if (payload.profileImageFile) {
      const uploadedImage = await firstValueFrom(this.fileService.uploadImage(payload.profileImageFile));
      urlImagenPerfil = uploadedImage.url;
    }

    const registerResult = await firstValueFrom(
      this.http.post<LoginResponse>(`${this.registroUrl}/instructor`, {
        email: payload.email,
        clave: payload.clave,
        nombreCompleto: payload.nombreCompleto,
        urlImagenPerfil: urlImagenPerfil,
        especialidad: payload.especialidad,
        biografia: payload.biografia,
        distrito: payload.distrito,
        direccion: payload.direccion,
      }),
    );

    if (!registerResult.success || !registerResult.usuario) {
      throw new Error(registerResult.message || 'No se pudo registrar');
    }

    const instructores = await firstValueFrom(
      this.http.get<InstructorResponse[]>(this.instructorUrl)
    );
    const instructor = instructores.find(i => i.idUsuario === registerResult.usuario!.idUsuario);
    if (!instructor) {
      throw new Error('No se encontró el instructor creado');
    }

    const documentNames: Record<DocumentKey, string> = {
      dni: 'DNI',
      titulo: 'Titulo universitario',
      antecedentes: 'Antecedentes penales',
      certificacion: 'Certificacion entrenamiento adaptado',
    };

    for (const key of Object.keys(payload.documentos) as DocumentKey[]) {
      const file = payload.documentos[key];
      if (!file) continue;

      const uploaded = await firstValueFrom(this.fileService.uploadFile(file));
      await firstValueFrom(
        this.http.post<DocumentoDto>(this.documentoUrl, {
          idDocumento: null,
          idInstructor: instructor.idInstructor,
          nombreDocumento: documentNames[key],
          urlArchivo: uploaded.url,
          estadoAprobacion: 'pendiente',
          fechaSubida: null,
        }),
      );
    }
  }
}