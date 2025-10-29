import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';

export interface RankingResponseItem {
  id: number;
  name: string;
  points: number;
  imageUrl?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class RankingService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.api}/v1/web/franchisor/ranking`;

  public getRanking(): Observable<RankingResponseItem[]> {
    return this.http.get<RankingResponseItem[]>(this.baseUrl);
  }
}
