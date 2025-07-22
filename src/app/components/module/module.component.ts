import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PanelComponent } from '../../shared/components/panel/panel.component';
import { ButtonLinkComponent } from '../../shared/components/button-link/button-link.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  standalone: true,
  imports: [CommonModule, ButtonLinkComponent, PanelComponent, RouterOutlet],
})
export class ModuleComponent {
  routes = [
    {
      name: 'HR Management',
      url: 'human-resources',
    },
  ];

  constructor(public router: Router, private activatedRoute: ActivatedRoute) {}

  isParentRoute(): boolean {
    const currentRoute = this.activatedRoute;
    return !currentRoute.firstChild;
  }
}
