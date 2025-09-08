import { Routes } from '@angular/router';
import { FranchiseeComponent } from './franchisee.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: FranchiseeComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clientes', loadChildren: () => import('./pages/users/users.routes').then((m) => m.routes) },
      { path: 'campanhas/comuns', loadChildren: () => import('./pages/common-campaign/common-campaign.routes').then((m) => m.routes) },
      { path: 'relatorios', loadChildren: () => import('./pages/reports/reports.routes').then((m) => m.routes) },
    ],
  },
];
