import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  navIsOpen = true;
  isMobile = false;

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
