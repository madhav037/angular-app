import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const loggedInUser = localStorage.getItem('loggedInUser') ?? sessionStorage.getItem('loggedInUser');

  if (!loggedInUser) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
