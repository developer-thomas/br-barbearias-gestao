import { Routes } from "@angular/router";
import { ListComponent } from "./list/list.component";
import { FormComponent } from "./form/form.component";
import { DetailsComponent } from "./details/details.component";

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
    },
  ];
  