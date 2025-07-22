import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PanelComponent } from '../../shared/components/panel/panel.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ButtonLinkComponent } from '../../shared/components/button-link/button-link.component';

@Component({
  selector: 'app-human-resources',
  standalone: true,
  templateUrl: './human-resources.component.html',
  imports: [CommonModule, PanelComponent, ButtonLinkComponent, RouterOutlet],
})
export class HumanResourcesComponent {
  parentLabel = 'Back';

  routes = [
    {
      name: 'Accounts',
      url: 'accounts',
    },
    {
      name: 'Employees',
      url: 'employees',
    },
    {
      name: 'Positions',
      url: 'positions',
    },
    {
      name: 'Departments',
      url: 'departments',
    },
  ];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : 'Back';
  }

  isParentRoute(): boolean {
    const currentRoute = this.activatedRoute;
    return !currentRoute.firstChild;
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
