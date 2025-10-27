import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { StorageService } from '../../core/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  public signin(data: any) {
    return this.http.post<SignInResponse>(`${environment.api}/v1/login`, data).pipe(
      tap((res) => {
        if (res?.token) {
          this.storageService.setToken(res.token);
        }
      }),
    );
  }
}

export type SignInResponse = {
  token: string;
  id: number;
  role: string;
  adminPermissions: string[];
}
