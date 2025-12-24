import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout-component/admin-layout-component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('../dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'add-vehicle',
        loadComponent: () => import('./add-vehicle/add-vehicle').then((m) => m.AddVehicle),
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./add-vehicle/add-vehicle').then((m) => m.AddVehicle),
      }
    ],
  },
];
