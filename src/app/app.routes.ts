import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Registeration } from './components/registeration/registeration';
import { LandingPage } from './components/landing-page/landing-page';
import { Dashboard } from './components/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { VehicleDetails } from './components/vehicle-details/vehicle-details';
import { autoLoginGuard } from './guards/auto-login-guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    canActivate: [autoLoginGuard],
  },
  {
    path: 'login',
    component: Login,
    canActivate: [autoLoginGuard],
  },
  {
    path: 'register',
    component: Registeration,
    canActivate: [autoLoginGuard],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },
  {
    path: 'vehicleDetail/:id',
    component: VehicleDetails,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
