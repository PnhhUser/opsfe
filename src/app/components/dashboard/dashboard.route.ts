import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PERMISSIONS } from '../../core/const/premissions.const';

export const dashboardRoute: Route = {
  path: 'dashboard',
  component: DashboardComponent,
  data: { breadcrumb: 'Dashboard', permission: PERMISSIONS.dashboard },
};
