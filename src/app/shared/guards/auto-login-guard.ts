import { inject } from '@angular/core';
import { CanActivate, CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { Auth } from '../../services/auth';

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(Auth);

  if (auth.getAccessToken()) {
    console.log('User is already logged in, redirecting to dashboard.');
    // router.navigate(['/dashboard']);
    return router.createUrlTree(['/dashboard']);
    // return false;
  }
  console.log('No logged in user, allowing access to public route.');
  return true;
};
