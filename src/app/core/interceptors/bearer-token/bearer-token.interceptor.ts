import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../../services/storage.service';


export const bearerTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const token = storage.getToken();

  const setHeaders: Record<string, string> = {
    'ngrok-skip-browser-warning': 'true',
  };

  if (token) {
    setHeaders['Authorization'] = `Bearer ${token}`;
  }

  req = req.clone({
    setHeaders,
  });

  return next(req);
};
