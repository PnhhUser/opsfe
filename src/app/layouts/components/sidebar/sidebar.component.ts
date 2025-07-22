import { Store } from '@ngrx/store';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboardIcon,
  LogOutIcon,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  Puzzle,
  Settings,
  ChartNoAxesCombined,
} from 'lucide-angular';
import * as AuthActions from '../../../store/auth/auth.actions';

const myIcons = {
  LogOutIcon,
  LayoutDashboardIcon,
  ChevronLeft,
  ChevronRight,
  Puzzle,
  Settings,
  ChartNoAxesCombined,
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, NgOptimizedImage, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider(myIcons),
    },
  ],
})
export class SidebarComponent {
  // Icons
  readonly LogoutIcon = LogOutIcon;
  readonly DashboardIcon = LayoutDashboardIcon;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly PuzzleIcon = Puzzle;
  readonly SettingsIcon = Settings;
  readonly ChartNoAxesCombinedIcon = ChartNoAxesCombined;
  // Logo URL
  readonly logoUrl = 'assets/images/lg.png';

  navItems = [
    {
      label: 'Dashboard',
      link: '/dashboard',
      icon: this.DashboardIcon,
    },
    {
      label: 'Modules',
      link: '/module',
      icon: this.PuzzleIcon,
    },
    {
      label: 'Analytics',
      link: '/analytics',
      icon: this.ChartNoAxesCombinedIcon,
    },
    {
      label: 'Settings',
      link: '/setting',
      icon: this.SettingsIcon,
    },
  ];

  constructor(private store: Store) {}

  // Sidebar state
  @Input() isNavOpen: boolean = true;

  @Output() toggle = new EventEmitter<boolean>();

  navOpen() {
    return this.isNavOpen;
  }

  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
    this.toggle.emit(this.isNavOpen);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
