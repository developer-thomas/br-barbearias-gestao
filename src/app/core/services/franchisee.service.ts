import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface FranchiseeItem {
  id: number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface FranchiseeRegionsResponse {
  [state: string]: {
    [city: string]: FranchiseeItem[];
  };
}

@Injectable({ providedIn: 'root' })
export class FranchiseeService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.api}/v1/web/franchisor/franchisees`;

  public getRegions(): Observable<FranchiseeRegionsResponse> {
    return this.http.get<FranchiseeRegionsResponse>(`${this.baseUrl}/regions`);
  }
}
