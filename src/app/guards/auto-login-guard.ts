import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const autoLoginGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const loggedInUser = localStorage.getItem('loggedInUser') ?? sessionStorage.getItem('loggedInUser');

  if (loggedInUser) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
