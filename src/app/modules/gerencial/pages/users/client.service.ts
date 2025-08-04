import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Pagination } from '../../../shared/models/pagination.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private http = inject(HttpClient);

  getClients(page?: number, size?: number, search?: string) {
    let params = new HttpParams();
    if (page) {
      params = params.append('page', page);
    }
    if (size) {
      params = params.append('size', size);
    }
    if (search) {
      params = params.append('search', search);
    }

    return this.http.get<Pagination<ClientResponse>>(`${environment.api}/client`, { params });
  }

  getClientById(id: string) {
    return this.http.get<ClientResponse>(`${environment.api}/client/${id}`);
  }

  save(data: any) {
    return this.http.post(`${environment.api}/client`, data);
  }

  changeStatus(id: string) {
    return this.http.patch<ClientResponse>(`${environment.api}/client/${id}/status`, {});
  }

  updateClient(id: string, client: any): Observable<ClientResponse> {
    return this.http.patch<ClientResponse>(`${environment.api}/${id}`, client)
  }

  deleteClient(id: any): void {
    this.http.delete(`${environment.api}/${id}`)
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
