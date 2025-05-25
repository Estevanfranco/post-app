import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environments } from '../../environments/environments.development';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  let headers = req.headers;
  headers = headers.set('Authorization', `Bearer ${token}`);
  headers = headers.set('x-api-key', environments.apiKey);

  const newReq = req.clone({
    headers,
  })

  return next(newReq);
};
