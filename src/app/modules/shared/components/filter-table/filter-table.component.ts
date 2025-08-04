import { Component, EventEmitter, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-filter-table',
  standalone: true,
  templateUrl: './filter-table.component.html',
  styleUrl: './filter-table.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
})
export class FilterTableComponent {
  @Output() filter = new EventEmitter<string>();
}
