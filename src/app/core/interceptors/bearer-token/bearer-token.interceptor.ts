import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../../services/storage.service';


export const bearerTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);

  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${storage.getToken()}`,
      'ngrok-skip-browser-warning': 'true'
    },
  });

  return next(req);
};
