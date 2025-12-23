import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Registeration } from './components/registeration/registeration';
import { LandingPage } from './components/landing-page/landing-page';
import { Dashboard } from './components/dashboard/dashboard';
import { authGuard } from './shared/guards/auth-guard';
import { VehicleDetails } from './components/vehicle-details/vehicle-details';
import { autoLoginGuard } from './shared/guards/auto-login-guard';
import { LifeCycleComponent } from './components/life-cycle-component/life-cycle-component';
import { BigComponent } from './components/big-component/big-component';
// import { BigComponent } from './components/big-component/big-component';

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
    // component: Dashboard,
    loadComponent: () => import('./components/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'vehicleDetail/:id',
    loadComponent: () =>
      import('./components/vehicle-details/vehicle-details').then((m) => m.VehicleDetails),
    canActivate: [authGuard],
  },
  {
    path: 'bigcomponent',
    // component: BigComponent,
    loadComponent: () =>
      import('./components/big-component/big-component').then((m) => m.BigComponent),
  },
  {
    path: 'lifecycledemo',
    children: [
      {
        path: 'parent',
        loadComponent: () =>
          import('./components/parent-life-cycle-component/parent-life-cycle-component').then(
            (m) => m.ParentLifeCycleComponent
          ),
      },
      {
        path: 'child',
        component: LifeCycleComponent,
      },
    ],
  },
  {
    path: 'learning',
    loadComponent: () => import('./components/learning/learning').then((m) => m.Learning),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
