import { Component, inject, signal, ViewChild } from '@angular/core';
import { DashboardCardComponent, DashboardCardData } from '../../../../../../shared/components/dashboard-card/dashboard-card.component';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexGrid, ApexStroke, ApexMarkers, ApexYAxis, ApexTitleSubtitle, ApexNonAxisChartSeries, ApexResponsive, ApexLegend, ApexPlotOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { PageHeaderComponent } from '../../../../../../shared/components/page-header/page-header.component';
import { Router } from '@angular/router';

export interface MetricCard {
  label: string
  value: string
  percentage: string
  isNegative: boolean
  iconColor: string
  iconBackground: string
  icon: string
}

export type ChartOptions = {
  series: ApexAxisChartSeries
  chart: ApexChart
  xaxis: ApexXAxis
  dataLabels: ApexDataLabels
  grid: ApexGrid
  stroke: ApexStroke
  markers: ApexMarkers
  yaxis: ApexYAxis
  title: ApexTitleSubtitle
}

export type DonutChartOptions = {
  series: ApexNonAxisChartSeries
  chart: ApexChart
  responsive: ApexResponsive[]
  labels: string[]
  colors: string[]
  legend: ApexLegend
  plotOptions: ApexPlotOptions
  dataLabels: ApexDataLabels
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatSelectModule, 
    MatFormFieldModule, 
    NgApexchartsModule,
    PageHeaderComponent,
    DashboardCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly router = inject(Router)

  @ViewChild("chart") chart!: ChartComponent
  @ViewChild("donutChart") donutChart!: ChartComponent

  activeToggle = signal<"quality" | "evolution">("evolution")

  selectedUnit = "Unidade Copacabana"
  selectedPeriod = "1 de Mar de 2023 a 9 de Mar de 2023"

  unitOptions = ["Unidade Copacabana", "Unidade Ipanema", "Unidade Barra", "Unidade Centro"]

  topMetrics: MetricCard[] = [
    {
      label: "Média Geral",
      value: "5.0",
      percentage: "50,2%",
      isNegative: true,
      iconColor: "#ffffff",
      iconBackground: "#22c55e",
      icon: "star",
    },
    {
      label: "Estrutura física/conforto",
      value: "4.3",
      percentage: "50,2%",
      isNegative: true,
      iconColor: "#ffffff",
      iconBackground: "#374151",
      icon: "thumb_up",
    },
    {
      label: "Atendimento unidade",
      value: "4.8",
      percentage: "50,2%",
      isNegative: true,
      iconColor: "#ffffff",
      iconBackground: "#f59e0b",
      icon: "support_agent",
    },
  ]

  qualityMetric: MetricCard = {
    label: "Padrão operacional/Qualidade",
    value: "500",
    percentage: "50,2%",
    isNegative: true,
    iconColor: "#ffffff",
    iconBackground: "#ef4444",
    icon: "person",
  }

  barbers = [
    {
      id: 0,
      img: 'assets/png/default-user.png',
      average: '5.0',
      name: 'Nome do barbeiro'
    },
    {
      id: 1,
      img: 'assets/png/default-user.png',
      average: '5.0',
      name: 'Nome do barbeiro'
    },
    {
      id: 2,
      img: 'assets/png/default-user.png',
      average: '5.0',
      name: 'Nome do barbeiro'
    },
    {
      id: 3,
      img: 'assets/png/default-user.png',
      average: '5.0',
      name: 'Nome do barbeiro'
    },
  ]

  // Line Chart Options
  public chartOptions: Partial<ChartOptions> = {
    series: [
      {
        name: "Média",
        data: [3.2, 3.8, 4.1, 4.8, 4.2, 4.6, 4.8, 4.3, 4.7, 4.1],
      },
    ],
    chart: {
      height: 300,
      type: "line",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#22c55e"],
    },
    markers: {
      size: 6,
      colors: ["#22c55e"],
      strokeColors: "#22c55e",
      strokeWidth: 2,
      hover: {
        size: 8,
      },
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: [
        "Jan 2019",
        "Fev 2019",
        "Mar 2019",
        "Abr 2019",
        "Mai 2019",
        "Jun 2019",
        "Jul 2019",
        "Ago 2019",
        "Set 2019",
        "Out 2019",
      ],
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
  }

  // Donut Chart Options
  public donutChartOptions: Partial<DonutChartOptions> = {
    series: [50, 50],
    chart: {
      type: "donut",
      height: 200,
    },
    labels: ["Progresso", "Restante"],
    colors: ["#22c55e", "#e5e7eb"],
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: "bold",
              color: "#1f2937",
              formatter: (val) => val + "%",
            },
            total: {
              show: true,
              showAlways: true,
              label: "",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#1f2937",
              formatter: () => "50%",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 150,
          },
        },
      },
    ],
  }

  setActiveToggle(toggle: "quality" | "evolution") {
    this.activeToggle.set(toggle)
  }

  goToBarberDashboard(id: any) {
    this.router.navigate([`gerencial/campanhas/inteligente/barbeiro/${id}`])
  }
}
