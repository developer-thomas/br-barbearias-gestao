import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { ClientService } from '../../../users/client.service';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    PageHeaderComponent,
    FilterTableComponent,
    CommomTableComponent,
    RouterModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private clientService = inject(ClientService);
  private toastr = inject(ToastrService);
  public questions = signal<any[]>([]);

  public displayedColumns: TableColumn[] = [
    { label: 'ID', key: 'id', type: 'text' },
    { label: 'Pergunta', key: 'question', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit() {
    this.getQuestions();
  }

  private getQuestions(search?: string) {
    let data: any[] = [];
    
    for(let i = 0; i < 10; i++) {
      data.push({
        id: i,
        question: 'Exemplo de pergunta',
        status: i % 2 === 0 ? 'Ativa' : 'Desativada'
      })
    }

    this.questions.set(data);
  }

  public filter(search: string) {
    this.getQuestions(search);
  }

  public gotoDetailPage(row: any) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
  }

  gotoEditPage(row: any) {
    this.router.navigate(['/admin/clients/edit', row.id])
  }

  deleteClient(row: any) {
    const deleteUser = confirm('Deseja deletar esse usuário?');
    if (deleteUser) {
      this.clientService.deleteClient(row.id);
      this.toastr.success('Cliente excluído com sucesso!')
    }

    return

  }
}
