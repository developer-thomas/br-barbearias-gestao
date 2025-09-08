import { Component } from '@angular/core';
import { ISidenavRoute, SidenavComponent } from '../shared/components/sidenav/sidenav.component';

@Component({
  selector: 'app-franchisee',
  standalone: true,
  imports: [
    SidenavComponent
  ],
  template: '<app-sidenav [routes]="routes" />'
})
export class FranchiseeComponent {
  routes: ISidenavRoute[] = [
    {
      route: "dashboard",
      label: "Dashboard",
      icon: "dashboard",
    },
    {
      route: "clientes",
      label: "Clientes",
      icon: "people",
    },
    {
      route: "campanhas/comuns",
      label: "Campanhas",
      icon: "campaign",
    },
    {
      route: "relatorios",
      label: "Relatórios",
      icon: "assessment",
    },
  ]
}
