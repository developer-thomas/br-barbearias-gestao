import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { BannersService, BannerDetailsResponse, DeleteBannerResponse } from '../banners.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

export interface BannerDetailsView {
  id: number;
  title: string;
  link: string;
  displayLink: string;
  target: string;
  rawTarget: string;
  locations: string[];
  startDate: string;
  endDate: string;
  imageUrl: string;
  status: string;
  isActive: boolean;
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
export class DetailsComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private bannersService = inject(BannersService)
  private toastr = inject(ToastrService)

  banner = signal<BannerDetailsView | null>(null)
  isLoading = signal(false)
  deleteConfirmationVisible = signal(false)
  isDeleting = signal(false)

  ngOnInit(): void {
    const bannerIdParam = this.route.snapshot.paramMap.get('id')

    if (!bannerIdParam) {
      this.toastr.error('Banner não encontrado.')
      this.router.navigate(['/gerencial/banners'])
      return
    }

    const bannerId = Number(bannerIdParam)

    if (!Number.isFinite(bannerId)) {
      this.toastr.error('Identificador de banner inválido.')
      this.router.navigate(['/gerencial/banners'])
      return
    }

    this.fetchBannerDetails(bannerId)
  }

  onEdit() {
    const currentBanner = this.banner()
    if (!currentBanner) {
      return
    }

    this.router.navigate(['/gerencial/banners/form', currentBanner.id])
  }

  onDelete() {
    const currentBanner = this.banner()
    if (!currentBanner || this.isDeleting()) {
      return
    }

    this.deleteConfirmationVisible.set(!this.deleteConfirmationVisible())
  }

  onCancelDelete() {
    if (this.isDeleting()) {
      return
    }

    this.deleteConfirmationVisible.set(false)
  }

  onConfirmDelete() {
    const currentBanner = this.banner()
    if (!currentBanner || this.isDeleting()) {
      return
    }

    this.deleteConfirmationVisible.set(false)
    this.isDeleting.set(true)

    this.bannersService
      .deleteBanner(currentBanner.id)
      .pipe(finalize(() => this.isDeleting.set(false)))
      .subscribe({
        next: (response: DeleteBannerResponse) => {
          const message = response?.message ?? 'Banner excluído com sucesso.'
          this.toastr.success(message)
          this.router.navigate(['/gerencial/banners'])
        },
        error: (error: unknown) => {
          console.error('Erro ao excluir banner', error)
          this.toastr.error('Não foi possível excluir o banner. Tente novamente.')
        },
      })
  }

  onToggleStatus() {
    const currentBanner = this.banner()

    if (!currentBanner) {
      return
    }

    const updated = { ...currentBanner, isActive: !currentBanner.isActive }
    this.banner.set(updated)
    console.log("Status do banner alterado:", updated.isActive)
  }

  private fetchBannerDetails(id: number): void {
    this.isLoading.set(true)

    this.bannersService
      .getBannerDetails(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.banner.set(this.mapBannerDetails(response))
        },
        error: (error: unknown) => {
          console.error('Erro ao buscar detalhes do banner', error)
          this.toastr.error('Não foi possível carregar os detalhes do banner.')
          this.router.navigate(['/gerencial/banners'])
        },
      })
  }

  private mapBannerDetails(details: BannerDetailsResponse): BannerDetailsView {
    const target = this.formatTarget(details.target)
    const startDate = this.formatDate(details.startDate)
    const endDate = this.formatDate(details.endDate)
    const locations = Array.isArray(details.regions) && details.regions.length > 0
      ? details.regions
      : ['-']

    return {
      id: details.id,
      title: details.title ?? '-',
      link: details.link ?? '-',
      displayLink: this.formatLink(details.link),
      target,
      rawTarget: details.target,
      locations,
      startDate,
      endDate,
      imageUrl: details.fileUrl ?? 'assets/mock/banner-image.png',
      status: details.status ?? '-',
      isActive: (details.status ?? '').toUpperCase() === 'ACTIVE',
    }
  }

  private formatTarget(target: string | null | undefined): string {
    if (!target) {
      return '-'
    }

    switch (target.toUpperCase()) {
      case 'BRANCH':
        return 'Filiais'
      case 'CLIENT':
        return 'Clientes'
      case 'ALL':
        return 'Todos'
      default:
        return target
    }
  }

  private formatDate(dateIso: string | null | undefined): string {
    if (!dateIso) {
      return '-'
    }

    const date = new Date(dateIso)

    if (isNaN(date.getTime())) {
      return '-'
    }

    return date.toLocaleDateString('pt-BR')
  }

  private formatLink(link: string | null | undefined): string {
    if (!link) {
      return '#'
    }

    if (/^https?:\/\//i.test(link)) {
      return link
    }

    return `https://${link}`
  }
}
