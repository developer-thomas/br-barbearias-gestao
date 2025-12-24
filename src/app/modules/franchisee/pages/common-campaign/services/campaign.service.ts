import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {


  baseUrl = environment.api + "/v1/web/franchise/campaigns/"
  constructor() { }
  httpClient = inject(HttpClient);

  getCampaigns() {
    return this.httpClient.get<any>(this.baseUrl);
  }
  getCampaign(id: string) {
    return this.httpClient.get<any>(this.baseUrl + id);
  }
  createCampaign(data: any) {
    return this.httpClient.post<any>(this.baseUrl + "new", data);
  }
}
