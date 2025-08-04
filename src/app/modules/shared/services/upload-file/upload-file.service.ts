import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  private http = inject(HttpClient);

  public upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadFileResponse>(`${environment.api}/upload-file/single`, formData);
  }
}

export type UploadFileResponse = {
  url: string;
}
