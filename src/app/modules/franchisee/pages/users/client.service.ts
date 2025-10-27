import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.api}/v1/web/franchisor/clients`;

  getClients(page?: number, size?: number, search?: string) {
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

    return this.http.get<ClientsListResponse>(this.baseUrl, { params });
  }

  getClientById(id: string) {
    return this.http.get<ClientResponse>(`${this.baseUrl}/${id}`);
  }

  save(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  changeStatus(id: string) {
    return this.http.patch<ClientResponse>(`${this.baseUrl}/${id}/status`, {});
  }

  updateClient(id: string, client: any): Observable<ClientResponse> {
    return this.http.patch<ClientResponse>(`${this.baseUrl}/${id}`, client)
  }

  deleteClient(id: any): void {
    this.http.delete(`${this.baseUrl}/${id}`)
  }
}

export type ClientResponse = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  birthdate: string;
  document: string;
  phone: string;
  avatar: string | null;
  canAccess: boolean;
  payment: string;
  addresses: ClientAddressDto[];
  gender?: string | null;
  loyaltyStartedAt?: string | null;
  lastVisit?: string | null;
  lastReviews?: ClientReviewDto[];
}

export type ClientAddressDto = {
  id: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string | null;
  district: string;
  city: string;
  state: string;
}

export type ClientsListResponse = {
  clients: ClientSummary[];
  pages: number;
  count: number;
};

export type ClientSummary = {
  id: number;
  name: string;
  membershipStatedAt: string | null;
  lastVisit: string | null;
};

export type ClientReviewDto = {
  id: string | number;
  createdAt?: string | null;
  date?: string | null;
  establishmentName?: string | null;
  establishment?: string | null;
  campaignName?: string | null;
  campaign?: string | null;
  professionalName?: string | null;
  professional?: string | null;
  participated?: boolean | null;
  haveParticipated?: boolean | null;
  status?: string | null;
}
