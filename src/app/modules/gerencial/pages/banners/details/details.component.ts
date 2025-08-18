import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

export interface BannerDetails {
  id: string
  title: string
  link: string
  targetAudience: string
  location: string
  startDate: string
  endDate: string
  imageUrl: string
  isActive: boolean
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatSlideToggleModule,
    PageHeaderComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  // In a real app, you would fetch this data based on the route parameter
  banner: BannerDetails = {
    id: "1",
    title: "Marina Silva",
    link: "www.link.com",
    targetAudience: "Filial",
    location: "Bahia, Salvador - São Paulo",
    startDate: "00/00/00",
    endDate: "00/00/00",
    imageUrl: "assets/mock/banner-image.png",
    isActive: true,
  }

  constructor() {
    // Example of getting the banner ID from the route
    const bannerId = this.route.snapshot.paramMap.get("id")
    console.log("Banner ID:", bannerId)
  }

  onEdit() {
    this.router.navigate(["/banners/form", this.banner.id])
  }

  onDelete() {
    if (confirm("Tem certeza que deseja excluir este banner?")) {
      console.log("Banner excluído:", this.banner.id)
      this.router.navigate(["/banners"])
    }
  }

  onToggleStatus() {
    this.banner.isActive = !this.banner.isActive
    console.log("Status do banner alterado:", this.banner.isActive)
  }
}
