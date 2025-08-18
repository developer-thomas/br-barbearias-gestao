import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.routes').then(m => m.routes),
  },
  {
    path: 'gerencial',
    loadChildren: () => import('./modules/gerencial/gerencial.routes').then(m => m.routes),
  },
  {
    path: 'franqueado',
    loadChildren: () => import('./modules/franchisee/franchisee.routes').then(m => m.routes),
  },
];
