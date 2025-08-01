import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const dashboardRoute: Route = {
  path: 'dashboard',
  component: DashboardComponent,
  data: { breadcrumb: 'Dashboard' },
};
