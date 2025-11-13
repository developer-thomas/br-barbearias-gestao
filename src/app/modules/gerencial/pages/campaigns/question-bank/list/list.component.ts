import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { QuestionBankService, QuestionDto } from '../question-bank.service';

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
  private toastr = inject(ToastrService);
  private questionBankService = inject(QuestionBankService);

  public questions = signal<any[]>([]);
  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);
  public totalItems = signal(0);
  public totalPages = signal(0);

  public displayedColumns: TableColumn[] = [
    { label: 'ID', key: 'id', type: 'text' },
    { label: 'Pergunta', key: 'title', type: 'text' },
    { label: 'Público', key: 'target', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit() {
    this.loadQuestions();
  }

  private loadQuestions(search?: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.questionBankService
      .getQuestions({ name: search })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          const questions = this.mapQuestions(response?.questions ?? []);
          this.questions.set(questions);
          this.totalItems.set(response?.count ?? questions.length);
          this.totalPages.set(response?.pages ?? 1);
        },
        error: (error) => {
          console.error('Erro ao carregar perguntas', error);
          this.toastr.error('Não foi possível carregar as perguntas.');
          this.errorMessage.set('Não foi possível carregar as perguntas.');
          this.questions.set([]);
        },
      });
  }

  public filter(search: string) {
    this.loadQuestions(search);
  }

  public gotoDetailPage(row: any) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
  }

  gotoEditPage(row: any) {
    if (!row?.id) {
      return;
    }

    this.router.navigate(['form', row.id], { relativeTo: this.activatedRoute });
  }

  deleteClient(row: any) {
    this.toastr.info('Remoção de perguntas não está disponível no momento.');
  }

  private mapQuestions(questions: QuestionDto[]) {
    return questions.map((question) => ({
      id: question.id,
      title: question.title ?? '-',
      target: this.formatTarget(question.target),
      rawTarget: question.target,
      status: this.formatStatus(question.status),
      rawStatus: question.status,
      createdAt: question.createdAt,
    }));
  }

  private formatTarget(target: string | null | undefined): string {
    if (!target) {
      return '-';
    }

    const normalized = target.toUpperCase();

    switch (normalized) {
      case 'FRANCHISEE':
        return 'Franqueado';
      case 'CLIENT':
        return 'Cliente';
      default:
        return target;
    }
  }

  private formatStatus(status: string | null | undefined): string {
    if (!status) {
      return '-';
    }

    return status.toUpperCase() === 'ACTIVE' ? 'Ativa' : 'Inativa';
  }
}
