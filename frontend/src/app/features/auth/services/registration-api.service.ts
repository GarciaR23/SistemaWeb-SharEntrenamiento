import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { DocumentKey } from '../modules/dtos/registration.models';
import { FileService } from '../../../core/services/file.service';

interface RegistroInstructorResponse {
  success: boolean;
  message: string;
  usuario: {
    idUsuario: number;
    email: string;
    rol: string;
    estadoCuenta: string;
    fechaRegistro: string;
  };
  idInstructor: number;
}

interface RegistroTutorResponse {
  success: boolean;
  message: string;
  token: string;
  usuario: {
    idUsuario: number;
    email: string;
    rol: string;
    estadoCuenta: string;
    fechaRegistro: string;
  };
  idTutor: number;
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
    let fotoUrl: string | null = 'https://via.placeholder.com/300';

    const registerResult = await firstValueFrom(
      this.http.post<RegistroTutorResponse>(`${this.registroUrl}/tutor`, {
        email: payload.correo,
        clave: payload.clave,
        nombreCompleto: payload.tutorNombre,
      }),
    );

    if (!registerResult.success || !registerResult.usuario) {
      throw new Error(registerResult.message || 'No se pudo registrar');
    }

    const idTutor = registerResult.idTutor;
    const gradoAutismoMap: Record<string, string> = {
      Leve: 'uno',
      Moderado: 'dos',
      Severo: 'tres',
      leve: 'uno',
      moderado: 'dos',
      severo: 'tres',
    };


    await firstValueFrom(
      this.http.post<PacienteDto>(this.pacienteUrl, {
        idPaciente: null,
        idTutor: idTutor,
        nombreCompleto: payload.pacienteNombre,
        urlImagenPaciente: fotoUrl,
        condicion: payload.condicion,
        gradoAutismo: gradoAutismoMap[payload.gradoAutismo] ?? payload.gradoAutismo,
        genero: payload.genero.toLowerCase(),
        edad: payload.edad,
        distrito: payload.distrito,
        direccion: payload.direccion,
      }),
    );
    localStorage.setItem('authToken_tutor', registerResult.token);
    localStorage.setItem('authUser_tutor', JSON.stringify(registerResult.usuario));
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
      this.http.post<RegistroInstructorResponse>(`${this.registroUrl}/instructor`, {
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

    const idInstructor = registerResult.idInstructor;

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
          idInstructor: idInstructor,
          nombreDocumento: documentNames[key],
          urlArchivo: uploaded.url,
          estadoAprobacion: 'pendiente',
          fechaSubida: null,
        }),
      );
    }
  }
}