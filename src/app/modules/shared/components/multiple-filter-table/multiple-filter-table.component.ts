import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

export interface FilterOption {
  label: string
  value: string
  icon?: string
  type: 'select' | 'button' | 'date'
  options?: { label: string; value: string }[]
}

export type ViewMode = 'list' | 'dashboard'

@Component({
  selector: 'app-multiple-filter-table',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './multiple-filter-table.component.html',
  styleUrl: './multiple-filter-table.component.scss'
})
export class MultipleFilterTableComponent {
  @Input() filters: FilterOption[] = []
  @Input() viewMode: ViewMode = 'list'
  @Output() viewModeChange = new EventEmitter<ViewMode>()
  @Output() filterChange = new EventEmitter<any>()

  toggleViewMode(mode: ViewMode) {
    this.viewMode = mode
    this.viewModeChange.emit(mode)
  }
}
