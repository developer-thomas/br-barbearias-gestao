import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { LabelAndInfoComponent } from '../../../../../shared/components/label-and-info/label-and-info.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { BooleanStatusPipe } from '../../../../../shared/pipes/boolean-status/boolean-status.pipe';
import { ClientResponse, ClientReviewDto, ClientService } from '../../client.service';
import { finalize } from 'rxjs';

type ClientDetailView = {
  id: string;
  avatar: string;
  name: string;
  birthDate: string;
  document: string;
  gender: string;
  email: string;
  phone: string;
  active: boolean;
};

type ClientReviewView = {
  id: string | number;
  date: string;
  stablishment: string;
  campaign: string;
  professional: string;
  haveParticipated: string;
  status?: string;
};

@Component({
  selector: 'app-clients-detail',
  standalone: true,
  templateUrl: './clients-detail.component.html',
  styleUrl: './clients-detail.component.scss',
  imports: [
    MatCardModule,
    MatSlideToggleModule,
    MatTabsModule,
    CommomTableComponent,
    LabelAndInfoComponent,
    PageHeaderComponent,
    BooleanStatusPipe,
  ],
})
export class ClientsDetailComponent implements OnInit {
  @Input() id!: string;

  private clientService = inject(ClientService);
  private toastr = inject(ToastrService);

  public title = 'Clientes';
  public pageSession = 'Detalhes do cliente';

  private readonly defaultAvatar = 'assets/png/default-user.png';

  public client = signal<ClientDetailView | null>(null);
  public lastReviews = signal<ClientReviewView[]>([]);
  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);
  public isUpdatingStatus = signal(false);

  public displayedColumns: TableColumn[] = [
    { label: 'Data', key: 'date', type: 'text' },
    { label: 'Estabelecimento', key: 'stablishment', type: 'text' },
    { label: 'Nome da campanha', key: 'campaign', type: 'text' },
    { label: 'Profissional', key: 'professional', type: 'text' },
    { label: 'Participou?', key: 'haveParticipated', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
  ];

  ngOnInit(): void {
    this.getClient();
  }

  private getClient(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.clientService
      .getClientById(this.id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.client.set(this.mapClientResponse(response));
          this.lastReviews.set(this.mapReviews(response.lastReviews ?? []));
        },
        error: (error) => {
          console.error('Erro ao carregar detalhes do cliente', error);
          this.toastr.error('Não foi possível carregar os dados do cliente.');
          this.errorMessage.set('Não foi possível carregar os dados do cliente.');
          this.client.set(null);
          this.lastReviews.set([]);
        },
      });
  }

  public changeStatus(checked: boolean): void {
    const currentClient = this.client();
    if (!currentClient) {
      return;
    }

    this.isUpdatingStatus.set(true);

    this.clientService
      .changeStatus(currentClient.id)
      .pipe(finalize(() => this.isUpdatingStatus.set(false)))
      .subscribe({
        next: (updatedClient) => {
          this.client.set(this.mapClientResponse(updatedClient));
          this.toastr.success('Status do cliente atualizado com sucesso.');
        },
        error: (error) => {
          console.error('Erro ao atualizar status do cliente', error);
          this.toastr.error('Não foi possível atualizar o status do cliente.');
          this.client.set({ ...currentClient, active: !checked });
        },
      });
  }

  private mapClientResponse(client: ClientResponse): ClientDetailView {
    return {
      id: client.id,
      avatar: client.avatar ?? this.defaultAvatar,
      name: client.name ?? '-',
      birthDate: this.formatDate(client.birthdate),
      document: this.formatDocument(client.document),
      gender: this.mapGender(client.gender),
      email: client.email ?? '-',
      phone: this.formatPhone(client.phone),
      active: client.active,
    };
  }

  private mapReviews(reviews: ClientReviewDto[]): ClientReviewView[] {
    if (!Array.isArray(reviews)) {
      return [];
    }

    return reviews.map((review) => ({
      id: review.id,
      date: this.formatDateTime(review.createdAt ?? review.date ?? null),
      stablishment: review.establishmentName ?? review.establishment ?? '-',
      campaign: review.campaignName ?? review.campaign ?? '-',
      professional: review.professionalName ?? review.professional ?? '-',
      haveParticipated: this.formatParticipation(review.participated ?? review.haveParticipated),
      status: review.status ?? undefined,
    }));
  }

  private formatParticipation(value?: boolean | null): string {
    if (value === null || value === undefined) {
      return 'Não informado';
    }

    return value ? 'Sim' : 'Não';
  }

  private formatDate(date?: string | null): string {
    if (!date) {
      return '-';
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(parsedDate);
  }

  private formatDateTime(date?: string | null): string {
    if (!date) {
      return '-';
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(parsedDate);
  }

  private formatDocument(document?: string | null): string {
    if (!document) {
      return '-';
    }

    const digits = document.replace(/\D/g, '');
    if (digits.length === 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    if (digits.length === 14) {
      return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    return document;
  }

  private formatPhone(phone?: string | null): string {
    if (!phone) {
      return '-';
    }

    const digits = phone.replace(/\D/g, '');

    if (digits.length === 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    if (digits.length === 11) {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    return phone;
  }

  private mapGender(gender?: string | null): string {
    if (!gender) {
      return 'Não informado';
    }

    const formattedGender = gender.toLowerCase();

    switch (formattedGender) {
      case 'male':
      case 'masculino':
      case 'm':
        return 'Masculino';
      case 'female':
      case 'feminino':
      case 'f':
        return 'Feminino';
      case 'other':
      case 'outro':
        return 'Outro';
      default:
        return gender;
    }
  }
}
