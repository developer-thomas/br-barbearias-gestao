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
    loadComponent: () => import('./modules/gerencial/gerencial.component').then(m => m.AdminComponent),
    loadChildren: () => import('./modules/gerencial/gerencial.routes').then(m => m.routes),
  },
  {
    path: 'franqueado',
    loadComponent: () => import('./modules/franchisee/franchisee.component').then(m => m.FranchiseeComponent),
    loadChildren: () => import('./modules/franchisee/franchisee.routes').then(m => m.routes),
  },
];
