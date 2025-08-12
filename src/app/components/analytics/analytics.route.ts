import { Route } from '@angular/router';
import { AnalyticsComponent } from './analytics.component';
import { PERMISSIONS } from '../../core/const/premissions.const';

export const analyticsRoute: Route = {
  path: 'analytics',
  component: AnalyticsComponent,
  data: { breadcrumb: 'Analytics', permission: PERMISSIONS.analytics },
};
