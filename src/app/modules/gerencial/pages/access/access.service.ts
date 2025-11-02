import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';

export interface AccessAdminDto {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AccessListResponse {
  admins: AccessAdminDto[];
  pages: number;
  count: number;
}

export interface AccessDetailDto {
  permissions?: string[];
  name?: string | null;
  email?: string | null;
  document?: string | null;
  id: number;
  fileUrl?: string | null;
  fileKey?: string | null;
  role?: string | null;
  status?: string | null;
}

export type AccessStatus = 'ACTIVE' | 'INACTIVE';

export interface UpdateAccessStatusPayload {
  status: AccessStatus;
}

export interface UpdateAccessStatusResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AccessService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.api}/v1/web/franchisor/access`;

  public getAccessList(page?: number, size?: number, search?: string): Observable<AccessListResponse> {
    let params = new HttpParams();

    if (page) {
      params = params.append('page', page);
    }

    if (size) {
      params = params.append('size', size);
    }

    if (search) {
      params = params.append('name', search);
    }

    return this.http.get<AccessListResponse>(this.baseUrl, { params });
  }

  public getAccessDetail(id: number | string): Observable<AccessDetailDto> {
    return this.http.get<AccessDetailDto>(`${this.baseUrl}/${id}/details`);
  }

  public updateAccessStatus(
    id: number | string,
    status: AccessStatus
  ): Observable<UpdateAccessStatusResponse> {
    const payload: UpdateAccessStatusPayload = { status };
    return this.http.patch<UpdateAccessStatusResponse>(`${this.baseUrl}/${id}/status`, payload);
  }
}
