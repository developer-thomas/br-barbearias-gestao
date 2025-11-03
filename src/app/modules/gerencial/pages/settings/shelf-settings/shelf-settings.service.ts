import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment.development';

export interface ShelfDto {
  id: number;
  name: string;
  points: number;
  expirateAt: string;
  status: string;
}

export interface ShelfListResponse {
  shelfs: ShelfDto[];
  pages: number;
  count: number;
}

export interface ShelfListQuery {
  name?: string;
  take?: number;
  skip?: number;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class ShelfSettingsService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.api}/v1/web/franchisor/config/shelf`;

  public getShelves(query?: ShelfListQuery): Observable<ShelfListResponse> {
    let params = new HttpParams();

    if (query?.name) {
      params = params.set('name', query.name);
    }

    if (query?.take !== undefined) {
      params = params.set('take', query.take);
    }

    if (query?.skip !== undefined) {
      params = params.set('skip', query.skip);
    }

    if (query?.status) {
      params = params.set('status', query.status);
    }

    return this.http.get<ShelfListResponse>(this.baseUrl, { params });
  }
}
