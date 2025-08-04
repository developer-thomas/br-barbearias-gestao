import { Routes } from '@angular/router';
import { ConfigEditComponent } from './pages/config-edit/config-edit.component';
import { ConfigFormComponent } from './pages/config-form/config-form.component';
import { ConfigListComponent } from './pages/config-list/config-list.component';

export const routes: Routes = [
  {
    path: '',
    component: ConfigListComponent,
  },
  {
    path: 'form',
    component: ConfigFormComponent,
  },
  {
    path: 'edit/:id',
    component: ConfigEditComponent,
  },
];
