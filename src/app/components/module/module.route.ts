import { Route } from '@angular/router';
import { ModuleComponent } from './module.component';
import { humanResourcesRoute } from '../human-resources/human-resources.route';
import { accessControlRoute } from '../access-control/access-control.route';
import { customersManagementRoute } from '../customers/customers.route';
import { storagiesRoute } from '../storagies/storagies.route';
import { PERMISSIONS } from '../../core/const/premissions.const';
import { PermissionGuard } from '../../core/guards/permission.guard';

export const moduleRoute: Route = {
  path: 'module',
  component: ModuleComponent,
  data: { breadcrumb: 'Business Modules', permission: PERMISSIONS.modules },
  children: [
    humanResourcesRoute,
    accessControlRoute,
    customersManagementRoute,
    storagiesRoute,
  ],
};
