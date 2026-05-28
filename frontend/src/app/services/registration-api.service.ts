import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { AuthApiService } from './auth-api.service';
import { DocumentKey } from './form-state.service';
import { FileService } from './fileservice';

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

interface InstructorRequest {
  idUsuario: number;
  nombreCompleto: string;
  urlImagenPerfil: string | null;
  especialidad: string;
  biografia: string;
  distrito: string;
  direccion: string;
}

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
  private readonly tutorUrl = 'http://localhost:8080/api/tutores';
  private readonly pacienteUrl = 'http://localhost:8080/api/pacientes';
  private readonly instructorUrl = 'http://localhost:8080/api/instructores';
  private readonly documentoUrl = 'http://localhost:8080/api/documentos';

  constructor(
    private http: HttpClient,
    private authApiService: AuthApiService,
    private fileService: FileService,
  ) {}

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
      this.authApiService.register(payload.correo, payload.clave, 'tutor'),
    );

    if (!registerResult.success || !registerResult.usuario) {
      throw new Error(registerResult.message || 'No se pudo registrar el usuario tutor');
    }

    const tutor = await firstValueFrom(
      this.http.post<TutorDto>(this.tutorUrl, {
        idTutor: null,
        idUsuario: registerResult.usuario.idUsuario,
        nombreCompleto: payload.tutorNombre,
      }),
    );

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
    email: string;
    clave: string;
    documentos: Record<DocumentKey, File | null>;
  }): Promise<void> {
    const registerResult = await firstValueFrom(
      this.authApiService.register(payload.email, payload.clave, 'instructor'),
    );

    if (!registerResult.success || !registerResult.usuario) {
      throw new Error(registerResult.message || 'No se pudo registrar el usuario instructor');
    }

    const instructor = await firstValueFrom(
      this.http.post<InstructorResponse>(this.instructorUrl, {
        idUsuario: registerResult.usuario.idUsuario,
        nombreCompleto: payload.nombreCompleto,
        urlImagenPerfil: null,
        especialidad: payload.especialidad,
        biografia: payload.biografia,
        distrito: payload.distrito,
        direccion: payload.direccion,
      } as InstructorRequest),
    );

    const documentNames: Record<DocumentKey, string> = {
      dni: 'DNI',
      titulo: 'Titulo universitario',
      antecedentes: 'Antecedentes penales',
      certificacion: 'Certificacion entrenamiento adaptado',
    };

    for (const key of Object.keys(payload.documentos) as DocumentKey[]) {
      const file = payload.documentos[key];
      if (!file) {
        continue;
      }

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
