import { HttpClient } from '@angular/common/http';
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

@Injectable({ providedIn: 'root' })
export class QuestionBankService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.api}/v1/web/franchisor/campaigns/questions`;

  createQuestion(payload: CreateQuestionRequest): Observable<CreateQuestionResponse> {
    return this.http.post<CreateQuestionResponse>(`${this.baseUrl}/new`, payload);
  }
}
