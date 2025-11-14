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

export interface BannerRegionDto {
  city: string;
  state: string;
}

export interface CreateBannerResponse {
  message: string;
  id: number;
}

export interface BannerDetailsResponse {
  id: number;
  title: string;
  target: string;
  link: string;
  fileUrl: string;
  fileKey: string;
  startDate: string;
  endDate: string;
  status: string;
  regions: string[];
}

export interface DeleteBannerResponse {
  message: string;
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

  public getRegions(): Observable<BannerRegionDto[]> {
    return this.http.get<BannerRegionDto[]>(`${this.baseUrl}/regions`);
  }

  public createBanner(formData: FormData): Observable<CreateBannerResponse> {
    return this.http.post<CreateBannerResponse>(`${this.baseUrl}/new`, formData);
  }

  public getBannerDetails(id: number | string): Observable<BannerDetailsResponse> {
    return this.http.get<BannerDetailsResponse>(`${this.baseUrl}/${id}/details`);
  }

  public deleteBanner(id: number | string): Observable<DeleteBannerResponse> {
    return this.http.delete<DeleteBannerResponse>(`${this.baseUrl}/${id}`);
  }
}
