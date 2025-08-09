import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { PanelComponent } from '../../shared/components/panel/panel.component';
import { ButtonLinkComponent } from '../../shared/components/button-link/button-link.component';

@Component({
  selector: 'app-access-control',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PanelComponent, ButtonLinkComponent],
  template: `<button
      *ngIf="isParentRoute()"
      (click)="goBack()"
      class="flex items-center text-sm text-blue-600 hover:underline mb-4"
    >
      ← {{ parentLabel }}
    </button>

    <app-panel *ngIf="isParentRoute()">
      <div *ngFor="let route of routes">
        <app-button-link
          [url]="route.url"
          [name]="route.name"
        ></app-button-link>
      </div>
    </app-panel>

    <router-outlet /> `,
})
export class AccessControlComponent {
  parentLabel = 'Back';

  routes = [
    {
      name: 'Roles',
      url: 'roles',
    },
    {
      name: 'Permissions',
      url: 'permissions',
    },
    {
      name: 'Role Setup',
      url: 'role-setup',
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
