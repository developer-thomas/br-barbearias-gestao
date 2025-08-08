import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

export interface PeriodProductData {
  date: string
  time: string
  validity: string
  product: string
  productDescription: string
  rescueValue: string
  configuration: string
  value: string
}

@Component({
  selector: 'app-period-product-tab',
  standalone: true,
  imports: [
    MatCardModule, 
    MatButtonModule
  ],
  templateUrl: './period-product-tab.component.html',
  styleUrl: './period-product-tab.component.scss'
})
export class PeriodProductTabComponent {
  @Input() data: PeriodProductData = {
    date: "00/00/00",
    time: "00:00",
    validity: "00/00/00",
    product: "Cupom",
    productDescription: "Exemplo preenchido",
    rescueValue: "00000",
    configuration: "Percentual",
    value: "00",
    
  }
}
