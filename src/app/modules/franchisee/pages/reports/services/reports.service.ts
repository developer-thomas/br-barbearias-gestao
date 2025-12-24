import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {


  baseUrl = environment.api + "/v1/web/franchise/reports/"
  franchisorUrl = environment.api + "/v1/web/franchisor/reports/"
  constructor() { }
  httpClient = inject(HttpClient);

  getOverview() {
    return this.httpClient.get<any>(this.baseUrl + "overview");
  }
  getCampaignReport(id: string) {
    return this.httpClient.get<any>(this.baseUrl + "campaign/" + id);
  }
  getEngagement() {
    return this.httpClient.get<any>(this.baseUrl + "engagement");
  }
  getLoyalty() {
    return this.httpClient.get<any>(this.baseUrl + "loyalty");
  }
  getBarberOverview(barberId: string) {
    return this.httpClient.get<any>(this.franchisorUrl + barberId + "/overview");
  }
  getreportsbyfranchisee(franchiseeId: string) {
    return this.httpClient.get<any>(this.franchisorUrl + franchiseeId + "/overview");
  }

}
