import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'landing-page',
  },
  {
    path: 'landing-page',
    loadChildren: () => import('./modules/landing-page/landing-page.routes').then(m => m.routes),
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.routes').then(m => m.routes),
  },
  {
    path: 'gerencial',
    loadChildren: () => import('./modules/gerencial/gerencial.routes').then(m => m.routes),
  },
];
