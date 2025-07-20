import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {}
