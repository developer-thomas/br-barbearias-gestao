import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs';
import { MatButtonModule } from "@angular/material/button"
import { MatExpansionModule } from "@angular/material/expansion"

export interface ISidenavRoute {
  route: string
  label: string
  icon: string
  children?: ISidenavRoute[]
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    RouterModule,
  ],
})
export class SidenavComponent {
  private breakpointObserver = inject(BreakpointObserver)
  private router = inject(Router)

  @Input() routes: ISidenavRoute[] = []

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  )

  logout() {
    this.router.navigate(["/"])
  }
}
