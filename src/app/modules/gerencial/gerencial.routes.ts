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
      { path: 'clientes', loadChildren: () => import('./pages/users/users.routes').then((m) => m.routes) },
      { path: 'campanhas/comuns', loadChildren: () => import('./pages/campaigns/common-campaign/common-campaign.routes').then((m) => m.routes) },
      { path: 'campanhas/aniversario', loadChildren: () => import('./pages/campaigns/birthdate-campaign/birthdate-campaign.routes').then((m) => m.routes) },
      { path: 'campanhas/feriados', loadChildren: () => import('./pages/campaigns/holiday-campaign/holiday-campaign.routes').then((m) => m.routes) },
      { path: 'configs', loadChildren: () => import('./pages/config/config.routes').then((m) => m.routes) },
    ],
  },
];
