import { Route } from '@angular/router';
import { AnalyticsComponent } from './analytics.component';

export const analyticsRoute: Route = {
  path: 'analytics',
  component: AnalyticsComponent,
  data: { breadcrumb: 'Analytics' },
};
