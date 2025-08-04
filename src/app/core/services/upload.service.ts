import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface FileResponse {
  url: string;
}
@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<FileResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FileResponse>(
      `${environment.api}/v1/upload-one-file`,
      formData
    );
  }
}
