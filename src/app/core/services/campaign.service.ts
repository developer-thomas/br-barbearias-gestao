import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Campaign } from '../models/campaign';
import { Observable } from 'rxjs';
import { Pagination } from '../../modules/shared/models/pagination.model';
import { environment } from '../../../environments/environment';

export interface CampaignsParams {
  name?: string;
  take?: number;
  skip?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'FINISHED' | 'CANCELED';
  type?: 'COMMON' | 'HOLIDAY' | 'INTELLIGENT' | 'RECOVERY' | 'BIRTHDAY';
  franchiseeId?: number;
  startDate?: string;
  endDate?: string;
}

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.api}/v1/web/franchisor/campaigns`;

  public getCampaigns(params: CampaignsParams): Observable<Pagination<Campaign>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key as keyof CampaignsParams];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return this.http.get<Pagination<Campaign>>(`${this.baseUrl}/approvals/list`, { params: httpParams });
  }
}
