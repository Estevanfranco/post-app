import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const authenticatedGuard: CanMatchFn = async (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAutenticated = await firstValueFrom(authService.checkStatus());
  if (isAutenticated) {
    router.navigateByUrl('/dashboard');
    return false;
  }

  return true;
};
