import { Routes } from '@angular/router';
import { FranchiseReportComponent } from './franchise-report/franchise-report.component';
import { BarberDashboardComponent } from './franchise-report/barber-dashboard/barber-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: FranchiseReportComponent,
  },
  {
    path: 'barbeiro/:id',
    component: BarberDashboardComponent,
  },
];
