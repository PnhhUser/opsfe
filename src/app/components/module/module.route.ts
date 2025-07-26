import { Route } from '@angular/router';
import { ModuleComponent } from './module.component';
import { humanResourcesRoute } from '../human-resources/human-resources.route';

export const moduleRoute: Route = {
  path: 'module',
  component: ModuleComponent,
  data: { breadcrumb: 'Business Modules' },
  children: [humanResourcesRoute],
};
