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

  public signin(data: SignInPayload) {
    return this.http.post<SignInResponse>(`${environment.api}/v1/login`, data).pipe(
      tap((res) => {
        if (res?.accessToken) {
          this.storageService.setToken(res.accessToken);
        }

        if (res) {
          this.storageService.setSession({
            id: res.id,
            role: res.role,
            permissions: res.permissions ?? [],
          });
        }
      }),
    );
  }
}

export type SignInResponse = {
  id: number;
  accessToken: string;
  role: string;
  permissions: string[];
}

export type SignInPayload = {
  credential: string;
  password: string;
}
