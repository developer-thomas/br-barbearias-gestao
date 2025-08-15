import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BooleanStatusPipe } from '../../pipes/boolean-status/boolean-status.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';

export type TableColumn = {
  label: string;
  key: string;
  type: 'text' | 'date' | 'currency' | 'status' | 'menu' | 'approvation';
}

@Component({
  selector: 'app-commom-table',
  standalone: true,
  templateUrl: './commom-table.component.html',
  styleUrl: './commom-table.component.scss',
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    BooleanStatusPipe,
    MatCheckboxModule,
    MatSlideToggleModule
  ],
})
export class CommomTableComponent<T> implements OnChanges, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<T>;

  @Input() useCheckbox = false;
  @Input({ required: true }) data!: T[];
  @Input({ required: true }) displayedColumns!: TableColumn[];
  @Input() useDetailBtn: boolean = true;
  @Input() useEditBtn: boolean = true;
  @Input() useDeleteBtn: boolean = true;
  // Marca as box de acordo com o conteúdo
  @Input() checkboxMarks: any[] = [];


  @Output() detail = new EventEmitter<T>();
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() checkboxChange = new EventEmitter<any>();

  // Botões da tela de aprovação de campanhas
  @Output() onApproveCampaign = new EventEmitter<any>();
  @Output() onReproveCampaign = new EventEmitter<any>();
  @Output() onchangeCampaignStatus = new EventEmitter<any>();

  public page = 1;
  public size = 10;
  public dataSource!: MatTableDataSource<T>;
  public displayedColumnsKeys!: string[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource = new MatTableDataSource(changes['data'].currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    if (changes['displayedColumns']) {
      this.displayedColumnsKeys = changes['displayedColumns'].currentValue.map((column: TableColumn) => column.key);
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
  }

  pagination(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.size = event.pageSize;
  }

  detailClick(row: T) {
    this.detail.emit(row);
  }

  editClick(row: T) {
    this.edit.emit(row);
  }

  deleteClick(row: T) {
    this.delete.emit(row);
  }

  onCheckboxChange(row: any, event: any) {
    this.checkboxChange.emit(row);
  }

  get displayedColumnsKeysWithCheckbox() {
    return this.useCheckbox
      ? ['select', ...this.displayedColumnsKeys]
      : [...this.displayedColumnsKeys]; // cópia para evitar referência
  }

  // Funções para o menu de aprovação de campanhas
  approveCampaign(row: any) {
    console.log('approve:', row);
    this.onApproveCampaign.emit(row)
  }

  repprovaCampaign(row: any) {
    this.onReproveCampaign.emit(row)
    console.log('reprove:', row);

  }

  changeCampaignStatus(event: any, row: any) {
    this.onchangeCampaignStatus.emit(event.checked);
    console.log(event.checked); // true ou false
    console.log('changeStatus:', row);
  }
}
