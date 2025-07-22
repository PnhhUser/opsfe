import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  templateUrl: './department.component.html',
  imports: [CommonModule],
})
export class DepartmentComponent {
  parentLabel = 'Back';

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
