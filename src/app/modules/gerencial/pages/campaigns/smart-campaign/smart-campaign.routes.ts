import { Routes } from "@angular/router";
import { ListComponent } from "./views/list/list.component";
import { DetailsComponent } from "./details/details.component";
import { FormComponent } from "./form/form.component";


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
      path: ':id',
      component: DetailsComponent,
    }
  ];
  