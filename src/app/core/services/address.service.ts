import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddressReponse } from '../models/address';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private http: HttpClient) {}

  getAddress(zipCode: string): Observable<AddressReponse> {
    return this.http.get<AddressReponse>(
      `https://viacep.com.br/ws/${zipCode}/json/`
    );
  }
}
