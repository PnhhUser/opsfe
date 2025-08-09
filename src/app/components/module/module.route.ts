import { Route } from '@angular/router';
import { ModuleComponent } from './module.component';
import { humanResourcesRoute } from '../human-resources/human-resources.route';
import { accessControlRoute } from '../access-control/access-control.route';
import { customersManagementRoute } from '../customers/customers.route';
import { storagiesRoute } from '../storagies/storagies.route';

export const moduleRoute: Route = {
  path: 'module',
  component: ModuleComponent,
  data: { breadcrumb: 'Business Modules' },
  children: [
    humanResourcesRoute,
    accessControlRoute,
    customersManagementRoute,
    storagiesRoute,
  ],
};
