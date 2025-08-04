import { Component } from '@angular/core';
import { DashboardCardComponent, DashboardCardData } from '../../../shared/components/dashboard-card/dashboard-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from "@angular/material/badge"
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    DashboardCardComponent,
    MatBadgeModule,
    PageHeaderComponent,
  ],
})
export class DashboardComponent {
  dashboardCards: DashboardCardData[] = [
    {
      value: "R$ 3.000.000,00",
      label: "Faturamento da campanha",
      icon: "trending_up",
      iconColor: "#ffffff",
      iconBackground: "#96e500",
      percentage: 50.2,
      isPositive: true,
    },
    {
      value: "83.706",
      label: "Quantos envios",
      icon: "play_arrow",
      iconColor: "#ffffff",
      iconBackground: "#374151",
      percentage: 50.2,
      isPositive: false,
    },
    {
      value: "83.706",
      label: "Clientes impactados",
      icon: "person",
      iconColor: "#ffffff",
      iconBackground: "#f59e0b",
      percentage: 50.2,
      isPositive: false,
    },
    {
      value: "83.706",
      label: "Envios por Whatsapp",
      icon: "chat",
      iconColor: "#ffffff",
      iconBackground: "#96e500",
      percentage: 50.2,
      isPositive: true,
    },
    {
      value: "83.706",
      label: "Envios por SMS",
      icon: "smartphone",
      iconColor: "#ffffff",
      iconBackground: "#374151",
      percentage: 50.2,
      isPositive: false,
    },
    {
      value: "83.706",
      label: "Envios por email",
      icon: "email",
      iconColor: "#ffffff",
      iconBackground: "#f59e0b",
      percentage: 50.2,
      isPositive: false,
    },
    {
      value: "500 hrs",
      label: "Tempo de duração",
      icon: "schedule",
      iconColor: "#ffffff",
      iconBackground: "#ef4444",
      percentage: 50.2,
      isPositive: false,
    },
  ]

  chartData = [
    { day: "Seg", date: "00/00", value: 85 },
    { day: "Ter", date: "00/00", value: 90 },
    { day: "Qua", date: "00/00", value: 75 },
    { day: "Qui", date: "00/00", value: 80 },
    { day: "Sex", date: "00/00", value: 95 },
    { day: "Sáb", date: "00/00", value: 70 },
    { day: "Dom", date: "00/00", value: 85 },
    { day: "Seg", date: "00/00", value: 88 },
    { day: "Ter", date: "00/00", value: 92 },
    { day: "Qua", date: "00/00", value: 78 },
    { day: "Qui", date: "00/00", value: 85 },
    { day: "Sex", date: "00/00", value: 90 },
  ]

  maxValue = Math.max(...this.chartData.map((item) => item.value))

  trackByIndex(index: number): number {
    return index
  }
}
