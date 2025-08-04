import { Routes } from '@angular/router';
import { ClientsDetailComponent } from './pages/clients-detail/clients-detail.component';
import { ClientsFormComponent } from './pages/clients-form/clients-form.component';
import { ClientsListComponent } from './pages/clients-list/clients-list.component';

export const routes: Routes = [
  {
    path: '',
    component: ClientsListComponent,
  },
  {
    path: 'form',
    component: ClientsFormComponent,
  },
  {
    path: ':id',
    component: ClientsDetailComponent,
  }
];
