import { Component, ViewChild } from '@angular/core';
import { DashboardCardComponent, DashboardCardData } from '../../../shared/components/dashboard-card/dashboard-card.component';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartComponent, ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexTitleSubtitle, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

export type BarChartOptions = {
  series: ApexAxisChartSeries
  chart: ApexChart
  xaxis: ApexXAxis
  yaxis: ApexYAxis
  dataLabels: ApexDataLabels
  grid: ApexGrid
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
    NgApexchartsModule, 
    DashboardCardComponent,
    PageHeaderComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @ViewChild("barChart") barChart!: ChartComponent
  @ViewChild("donutChart") donutChart!: ChartComponent

  // Top row cards data
  topRowCards: DashboardCardData[] = [
    {
      value: "R$ 3.000.000,00",
      label: "Faturamento da campanha",
      icon: "trending_up",
      iconColor: "#ffffff",
      iconBackground: "#22c55e",
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
  ]

  // Duration card data
  durationCard: DashboardCardData = {
    value: "500 hrs",
    label: "Tempo de duração",
    icon: "schedule",
    iconColor: "#ffffff",
    iconBackground: "#ef4444",
    percentage: 50.2,
    isPositive: false,
  }

  // Bottom row cards data
  bottomRowCards: DashboardCardData[] = [
    {
      value: "83.706",
      label: "Envios por Whatsapp",
      icon: "chat",
      iconColor: "#ffffff",
      iconBackground: "#22c55e",
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
  ]

  // Bar Chart Options
  public barChartOptions: Partial<BarChartOptions> = {
    series: [
      {
        name: "Clientes",
        data: [2800, 2600, 2900, 2700, 2800, 2500, 2600, 2400, 2700, 2300, 2500, 2200],
      },
    ],
    chart: {
      type: "bar",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [
        "Seg 00/00",
        "Ter 00/00",
        "Qua 00/00",
        "Qui 00/00",
        "Sex 00/00",
        "Sáb 00/00",
        "Dom 00/00",
        "Seg 00/00",
        "Ter 00/00",
        "Qua 00/00",
        "Qui 00/00",
        "Sex 00/00",
      ],
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "10px",
        },
        rotate: -45,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
        formatter: (val) => val.toString(),
      },
      min: 0,
      max: 3000,
      tickAmount: 3,
    },
    grid: {
      show: true,
      borderColor: "#f3f4f6",
      strokeDashArray: 0,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  }

  // Donut Chart Options
  public donutChartOptions: Partial<DonutChartOptions> = {
    series: [50, 50],
    chart: {
      type: "donut",
      height: 200,
    },
    labels: ["Impacto", "Restante"],
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
}
