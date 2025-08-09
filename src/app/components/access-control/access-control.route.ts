import { Route } from '@angular/router';
import { AccessControlComponent } from './access-control.component';
import { permissionsRoute } from '../permissions/permissions.route';
import { rolesRoute } from '../roles/roles.route';
import { roleSetupRoute } from '../role-setup/role-setup.route';

export const accessControlRoute: Route = {
  path: 'access-control',
  component: AccessControlComponent,
  data: { breadcrumb: 'Access Control' },
  children: [permissionsRoute, rolesRoute, roleSetupRoute],
};
