import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment.development';

export interface CreateQuestionRequest {
  target: QuestionTarget;
  type: QuestionType;
  title: string;
}

export interface CreateQuestionResponse {
  message: string;
}

export type QuestionTarget = 'FRANCHISEE' | 'CLIENT';
export type QuestionType = 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'TEXT';

export interface QuestionDto {
  id: number;
  title: string;
  status: string;
  target: QuestionTarget;
  createdAt: string;
}

export interface QuestionListResponse {
  questions: QuestionDto[];
  pages: number;
  count: number;
}

export interface QuestionListQuery {
  name?: string;
  take?: number;
  skip?: number;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class QuestionBankService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.api}/v1/web/franchisor/campaigns/questions`;

  createQuestion(payload: CreateQuestionRequest): Observable<CreateQuestionResponse> {
    return this.http.post<CreateQuestionResponse>(`${this.baseUrl}/new`, payload);
  }

  getQuestions(query?: QuestionListQuery): Observable<QuestionListResponse> {
    let params = new HttpParams();

    if (query?.name) {
      params = params.set('name', query.name);
    }

    if (query?.take !== undefined) {
      params = params.set('take', query.take);
    }

    if (query?.skip !== undefined) {
      params = params.set('skip', query.skip);
    }

    if (query?.status) {
      params = params.set('status', query.status);
    }

    return this.http.get<QuestionListResponse>(this.baseUrl, { params });
  }
}
