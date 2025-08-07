import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { Store } from '@ngrx/store';
import { selectAuthLoading } from '../store/auth/auth.selectors';
import { LoadingComponent } from '../shared/components/loading/loading.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    TopbarComponent,
    LoadingComponent,
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  navIsOpen = false;
  isMobile = false;

  loading$;

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectAuthLoading);
  }

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // md breakpoint
  }

  navOpen() {
    return this.navIsOpen;
  }

  toggleNav(open: boolean) {
    this.navIsOpen = open;
  }
}
