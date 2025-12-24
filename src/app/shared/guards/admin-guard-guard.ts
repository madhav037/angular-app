import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authservice = inject(Auth);
  const router = inject(Router);
  const allowedRole = route.data['requiredRole'];

  return authservice.getUserRole().pipe(
    map((role) => {
      if (role === allowedRole) {
        return true;
      } else {
        alert('Access denied. Admins only.');
        router.navigate(['/dashboard']);
        return false;
      }
    })
  ); 
};
