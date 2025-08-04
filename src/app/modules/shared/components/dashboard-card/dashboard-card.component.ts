import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export interface DashboardCardData {
  value: string
  label: string
  icon: string
  iconColor: string
  iconBackground: string
  percentage?: number
  isPositive?: boolean
}

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [
    MatIcon,
    CommonModule
  ],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.scss'
})
export class DashboardCardComponent {
  @Input() data!: DashboardCardData
}
