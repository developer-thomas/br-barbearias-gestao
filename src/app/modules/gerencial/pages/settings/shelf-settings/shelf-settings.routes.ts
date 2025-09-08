import { Routes } from "@angular/router";
import { ListComponent } from "./list/list.component";
import { FormComponent } from "./form/form.component";
import { ShelfDetailsComponent } from "./shelf-details/shelf-details.component";

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
      component: ShelfDetailsComponent
    }
  ];
  