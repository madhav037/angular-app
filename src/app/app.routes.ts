import { Routes } from '@angular/router';
import { LandingPage } from './views/landing-page/landing-page';
import { Login } from './views/login/login';
import { Registeration } from './views/registeration/registeration';
import { authGuard } from './shared/guards/auth-guard';
import { LifeCycleComponent } from './views/life-cycle-component/life-cycle-component';
import { adminGuard } from './shared/guards/admin-guard-guard';
import { Roles } from './shared/model/roleModel';
import { publicGuard } from './shared/guards/auto-login-guard';
// import { BigComponent } from './components/big-component/big-component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    canActivate: [publicGuard],
  },
  {
    path: 'login',
    component: Login,
    canActivate: [publicGuard],
  },
  {
    path: 'register',
    component: Registeration,
    canActivate: [publicGuard],
  },
  {
    path: 'dashboard',
    // component: Dashboard,
    loadComponent: () => import('./views/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'vehicleDetail/:id',
    loadComponent: () =>
      import('./views/vehicle-details/vehicle-details').then((m) => m.VehicleDetails),
    canActivate: [authGuard],
  },
  {
    path: 'booking',
    loadComponent: () => import('./views/booking-details/booking-details').then((m) => m.BookingDetails),
    canActivate: [authGuard],
  },
  {
    path: 'bigcomponent',
    // component: BigComponent,
    loadComponent: () =>
      import('./views/big-component/big-component').then((m) => m.BigComponent),
  },
  {
    path: 'lifecycledemo',
    children: [
      {
        path: 'parent',
        loadComponent: () =>
          import('./views/parent-life-cycle-component/parent-life-cycle-component').then(
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
    path: 'admin',
    canActivate: [adminGuard],
    data : { requiredRole: Roles.ADMIN },
    loadChildren: () =>
      import('./views/Admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'learning',
    loadComponent: () => import('./views/learning/learning').then((m) => m.Learning),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
