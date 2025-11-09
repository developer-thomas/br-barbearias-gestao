import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment.development';

export interface UpdateScoreRequest {
  search: number;
  intelSearch: number;
  sale: number;
  service: number;
}

export interface UpdateScoreResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ScoreSettingsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.api}/v1/web/franchisor/config/score`;

  public updateScoreConfiguration(payload: UpdateScoreRequest): Observable<UpdateScoreResponse> {
    return this.http.patch<UpdateScoreResponse>(`${this.baseUrl}/update`, payload);
  }
}
