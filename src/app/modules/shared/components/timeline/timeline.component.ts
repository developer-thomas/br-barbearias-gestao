import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TimelineModule } from 'primeng/timeline';
import { map, shareReplay } from 'rxjs';

export type TimelineEvent = {
  icon: string;
  completed: boolean;
  title: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  imports: [
    CommonModule,
    TimelineModule,
    MatIconModule,
  ],
})
export class TimelineComponent {
  private breakpointObserver = inject(BreakpointObserver);

  public isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay(),
  );

  @Input({ required: true }) events: TimelineEvent[] = [];
}
