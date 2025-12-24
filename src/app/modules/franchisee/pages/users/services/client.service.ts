import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private readonly baseUrl = environment.api + "/v1/web/franchise/clients/"
  constructor() { }
  private readonly httpClient = inject(HttpClient);

  getClients() {
    return this.httpClient.get<any>(this.baseUrl);
  }
  getClient(id: string) {
    return this.httpClient.get<any>(this.baseUrl + id);
  }
}
