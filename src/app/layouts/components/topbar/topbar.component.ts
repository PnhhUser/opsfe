import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { filter, map } from 'rxjs';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink],
})
export class TopbarComponent {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.breadcrumbs = this.buildBreadcrumb(this.route.root);

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.buildBreadcrumb(this.route.root))
      )
      .subscribe((breadcrumbs) => {
        this.breadcrumbs = breadcrumbs;
      });
  }

  private buildBreadcrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'];
      if (label) {
        breadcrumbs.push({ label, url });
      }

      return this.buildBreadcrumb(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
