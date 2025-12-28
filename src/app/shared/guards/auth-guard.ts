import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { catchError, firstValueFrom, map, of, tap } from 'rxjs';
import { environment } from '../../../environment/environment';

export const authGuard: CanMatchFn = async () => {
  const router = inject(Router);
  const authservice = inject(Auth);

  if (environment.bypassAuthGuards === true) {
    console.log('Bypassing auth guard as per environment settings.');
    return true;
  }

  if (authservice.getAccessToken()) {
    console.log('Access token found, allowing access to protected route.');
    return true;
  }

 try {
    await firstValueFrom(authservice.refreshToken());
    if (authservice.getAccessToken()) {
      console.log('Token refreshed successfully, allowing access to protected route.');
      return true;
    }
  } catch {
  }
  console.log('No valid access token, redirecting to login.');
  // router.navigate(['/login']);
  return router.createUrlTree(['/login']);
  // return false;
};
