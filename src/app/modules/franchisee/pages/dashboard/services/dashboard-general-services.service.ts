import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardGeneralServicesService {

  baseUrl = environment.api
  constructor() { }
  httpClient = inject(HttpClient);

  getOverview() {
    return this.httpClient.get<any>(this.baseUrl + "/v1/web/franchise/dashboard/overview");
  }
  getClients() {
    return this.httpClient.get(this.baseUrl + "/v1/web/franchise/dashboard/clients");
  }
  getCampaigns() {
    return this.httpClient.get(this.baseUrl + "/v1/web/franchise/dashboard/campaigns");
  }
  getEngagement() {
    return this.httpClient.get(this.baseUrl + "/v1/web/franchise/dashboard/engagement");
  }
  getLoyalty() {
    return this.httpClient.get(this.baseUrl + "/v1/web/franchise/dashboard/loyalty");
  }
  getVisits() {
    return this.httpClient.get(this.baseUrl + "/v1/web/franchise/dashboard/visits");
  }

}
