import { Routes } from '@angular/router';
import { AdminComponent } from './gerencial.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clients', loadChildren: () => import('./pages/users/users.routes').then((m) => m.routes) },
      { path: 'configs', loadChildren: () => import('./pages/config/config.routes').then((m) => m.routes) },
    ],
  },
];
