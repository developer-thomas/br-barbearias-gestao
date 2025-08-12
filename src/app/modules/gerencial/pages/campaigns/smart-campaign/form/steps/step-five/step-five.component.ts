import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { CommomTableComponent, TableColumn } from '../../../../../../../shared/components/commom-table/commom-table.component';

interface SelectedQuestions {
  id: any;
  linkedTo: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-step-five',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    CommomTableComponent
  ],
  templateUrl: './step-five.component.html',
  styleUrl: './step-five.component.scss'
})
export class StepFiveComponent implements OnInit {
  tableData = signal<any[]>([])
  showSelectedQuestions: boolean = true;

  private fb = inject(FormBuilder);

  form!: FormGroup;
  
  constructor() {
    this.form = this.fb.group({
      linkedTo: ['']
    })
  }

  ngOnInit(): void {
    this.loadQuestions()
  }
  
  public linkedToOptions = [
    { id: 0, label: 'Franquia 01' },
    { id: 1, label: 'Franquia 02' },
    { id: 2, label: 'Franquia 03' }
  ]

  public questionCategory = [
    { id: 0, label: 'Categoria 01' },
    { id: 1, label: 'Categoria 02' },
    { id: 2, label: 'Categoria 03' }
  ]

  public displayedColumns: TableColumn[] = [
    { label: 'ID', key: 'id', type: 'text' },
    { label: 'Vinculado a que', key: 'linkedTo', type: 'text' },
    { label: 'Categoria', key: 'category', type: 'text' },
    { label: 'Pergunta', key: 'question', type: 'text' },
  ];

  public selectedQuestions = signal<SelectedQuestions[]>([]);

  loadQuestions() {
    let data = [];

    for (let i = 0; i < 10; i++) {
      data.push({
        id: i,
        linkedTo: 'Barbeiro',
        category: 'Categoria',
        question: 'Lorem ipsum dolor sit amet. Aut esse reprehederit',
        description: 'Lorem ipsum dolor sit amet. Aut esse reprehederit',
      })
    }

    this.tableData.set(data);
  }

  addQuestion(row: any) {
    this.selectedQuestions.set([...this.selectedQuestions(), row])
  }

  removeQuestion(rowId: any) {
    const updatedList = this.selectedQuestions().filter(question => {
      return question.id !== rowId
    })

    this.selectedQuestions.set(updatedList)
  }

  toggleQuestionVisibility() {
    this.showSelectedQuestions = !this.showSelectedQuestions;
  }
  
}
