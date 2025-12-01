import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment.development';

export interface CommonCampaignListQuery {
  page?: number;
  take?: number;
  status?: string;
  type?: string;
  franchiseeId?: number;
  startDate?: string;
  endDate?: string;
}

export interface CommonCampaignListItem {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  hour: number;
  sent: number;
  impact: number;
  type?: string;
}

export interface CommonCampaignListResponse {
  pages: number;
  count: number;
  items: CommonCampaignListItem[];
}

@Injectable({ providedIn: 'root' })
export class CommonCampaignService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.api}/v1/web/franchisor/campaigns/common`;

  public getCommonCampaigns(query?: CommonCampaignListQuery): Observable<CommonCampaignListResponse> {
    let params = new HttpParams();

    if (query?.page !== undefined) {
      params = params.set('page', query.page.toString());
    }

    if (query?.take !== undefined) {
      params = params.set('take', query.take.toString());
    }

    if (query?.status) {
      params = params.set('status', query.status);
    }

    if (query?.type) {
      params = params.set('type', query.type);
    }

    if (query?.franchiseeId !== undefined) {
      params = params.set('franchiseeId', query.franchiseeId.toString());
    }

    if (query?.startDate) {
      params = params.set('startDate', query.startDate);
    }

    if (query?.endDate) {
      params = params.set('endDate', query.endDate);
    }

    return this.http.get<CommonCampaignListResponse>(`${this.baseUrl}/list`, { params });
  }
}

