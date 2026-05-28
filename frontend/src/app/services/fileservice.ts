import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CloudinaryUploadResponse {
  url: string;
  publicId: string;
  resourceType: string;
  originalFilename: string;
}

@Injectable({ providedIn: 'root' })
export class FileService {
  private readonly baseUrl = 'http://localhost:8080/api/cloudinary';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<CloudinaryUploadResponse>(`${this.baseUrl}/images`, formData);
  }

  uploadFile(file: File): Observable<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<CloudinaryUploadResponse>(`${this.baseUrl}/files`, formData);
  }
}

