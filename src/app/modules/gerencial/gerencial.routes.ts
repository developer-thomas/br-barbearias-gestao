import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [


  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clientes', loadChildren: () => import('./pages/users/users.routes').then((m) => m.routes) },
  { path: 'campanhas/comuns', loadChildren: () => import('./pages/campaigns/common-campaign/common-campaign.routes').then((m) => m.routes) },
  { path: 'campanhas/aniversario', loadChildren: () => import('./pages/campaigns/birthdate-campaign/birthdate-campaign.routes').then((m) => m.routes) },
  { path: 'campanhas/feriados', loadChildren: () => import('./pages/campaigns/holiday-campaign/holiday-campaign.routes').then((m) => m.routes) },
  { path: 'campanhas/recuperacao', loadChildren: () => import('./pages/campaigns/recovery-campaign/recovery-campaign.routes').then((m) => m.routes) },
  { path: 'campanhas/inteligente', loadChildren: () => import('./pages/campaigns/smart-campaign/smart-campaign.routes').then((m) => m.routes) },
  { path: 'campanhas/aprovacao', loadChildren: () => import('./pages/campaigns/approvation-campaign/approvation-campaign.routes').then((m) => m.routes) },
  { path: 'campanhas/banco-perguntas', loadChildren: () => import('./pages/campaigns/question-bank/question-bank.routes').then((m) => m.routes) },
  { path: 'configuracao/pontuacao', loadChildren: () => import('./pages/settings/score-setting/score-settings.routes').then((m) => m.routes) },
  { path: 'configuracao/prateleira', loadChildren: () => import('./pages/settings/shelf-settings/shelf-settings.routes').then((m) => m.routes) },
  { path: 'relatorios', loadChildren: () => import('./pages/reports/reports.routes').then((m) => m.routes) },
  { path: 'banners', loadChildren: () => import('./pages/banners/banners.routes').then((m) => m.routes) },
  { path: 'ranking', loadChildren: () => import('./pages/ranking/ranking.routes').then((m) => m.routes) },
  { path: 'acessos', loadChildren: () => import('./pages/access/access.routes').then((m) => m.routes) },
]
