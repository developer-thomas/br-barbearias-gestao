import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

export interface AdminBannerDto {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface BannersListResponse {
  pages: number;
  count: number;
  banners: AdminBannerDto[];
}

export interface BannersListQuery {
  name?: string;
  take?: number;
  skip?: number;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class BannersService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.api}/v1/web/franchisor/banners`;

  public getBanners(query?: BannersListQuery): Observable<BannersListResponse> {
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

    return this.http.get<BannersListResponse>(this.baseUrl, { params });
  }
}
