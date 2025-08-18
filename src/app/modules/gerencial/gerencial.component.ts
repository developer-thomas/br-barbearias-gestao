import { Component } from '@angular/core';
import { ISidenavRoute, SidenavComponent } from '../shared/components/sidenav/sidenav.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: '<app-sidenav [routes]="routes"></app-sidenav>',
  imports: [
    SidenavComponent,
  ],
})
export class AdminComponent {
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
      route: "",
      label: "Campanhas",
      icon: "campaign",
      children: [
        { route: "campanhas/comuns", label: "Comuns", icon: "circle" },
        { route: "campanhas/aniversario", label: "Aniversário", icon: "circle" },
        { route: "campanhas/feriados", label: "Feriados", icon: "circle" },
        { route: "campanhas/recuperacao", label: "Recuperação", icon: "circle" },
        { route: "campanhas/inteligente", label: "Inteligente", icon: "circle" },
        { route: "campanhas/aprovacao", label: "Aprovação (franquiados)", icon: "circle" },
        { route: "campanhas/banco-perguntas", label: "Banco de perguntas", icon: "circle" },
      ],
    },
    {
      route: "relatorios",
      label: "Relatórios",
      icon: "assessment",
    },
    {
      route: "configuracao",
      label: "Configuração",
      icon: "settings",
      children: [
        { route: "configuracao/pontuacao", label: "Pontuação", icon: "circle" },
        { route: "configuracao/prateleira", label: "Prateleira", icon: "circle" },
      ],
    },
    {
      route: "banners",
      label: "Banners",
      icon: "image",
    },
    {
      route: "ranking",
      label: "Ranking",
      icon: "leaderboard",
    },
    {
      route: "acessos",
      label: "Acessos",
      icon: "lock",
    },
  ];
}
