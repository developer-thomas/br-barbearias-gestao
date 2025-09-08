import { Routes } from "@angular/router";
import { ListComponent } from "./views/list/list.component";
import { DetailsComponent } from "./details/details.component";
import { FormComponent } from "./form/form.component";
import { BarberDashboardComponent } from "./views/dashboard/barber-dashboard/barber-dashboard/barber-dashboard.component";


export const routes: Routes = [
    {
      path: '',
      component: ListComponent,
    },
    {
      path: 'form',
      component: FormComponent,
    },
    {
      path: 'barbeiro/:id',
      component: BarberDashboardComponent,
    },
    {
      path: ':id',
      component: DetailsComponent,
    }
    
  ];
  