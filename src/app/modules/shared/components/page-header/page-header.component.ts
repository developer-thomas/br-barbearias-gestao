import { Component, Input } from '@angular/core';
import { UserCardComponent } from '../user-card/user-card.component';
import { MatIcon } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [UserCardComponent, MatIcon, MatBadgeModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  @Input({ required: true }) public title!: string;
  @Input() public pageSession?: string;
}
