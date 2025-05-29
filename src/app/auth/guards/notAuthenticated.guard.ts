import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const notAuthenticated: CanMatchFn = async (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAutenticated = await firstValueFrom(authService.checkStatus());

  if (!isAutenticated) {
    router.navigateByUrl('/auth/login');
    return false;
  }
  return true;
};
