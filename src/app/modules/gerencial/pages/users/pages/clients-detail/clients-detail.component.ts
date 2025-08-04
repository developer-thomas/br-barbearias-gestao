import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { LabelAndInfoComponent } from '../../../../../shared/components/label-and-info/label-and-info.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { BooleanStatusPipe } from '../../../../../shared/pipes/boolean-status/boolean-status.pipe';
import { ClientResponse, ClientService } from '../../client.service';

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

  public client = signal<any | null>(null);
  public lastReviews = signal<any[]>([]);

  public displayedColumns: TableColumn[] = [
    { label: 'Data', key: 'date', type: 'text' },
    { label: 'Estabelecimento', key: 'stablishment', type: 'text' },
    { label: 'Nome da campanha', key: 'campaign', type: 'text' },
    { label: 'Profissional', key: 'professional', type: 'text' },
    { label: 'Participou?', key: 'haveParticipated', type: 'currency' },
  ];

  ngOnInit(): void {
    this.getClient();
  }

  private getClient(): void {

    this.client.set({
      avatar: 'assets/png/default-user.png',
      name: 'Marina Silva',
      birthDate: '00/00/00',
      document: '000.000.000-00',
      gender: 'Feminino',
      email: 'mail@email.com',
      phone: '(00) 00000-0000',
      active: true
    })

    let reviews: any[] = [];

    for(let i = 0; i < 7; i++) {
      reviews.push(
        {
          id: 1,
          date: '00/00/0000',
          stablishment: 'Estabelecimento',
          campaign: 'João Carlos',
          professional: 'Profissional',
          haveParticipated: 0,
          status: 'Aprovado',
        },
      )
    }

    this.lastReviews.set(reviews);
    
  }

  public changeStatus(): void {
  }
}
