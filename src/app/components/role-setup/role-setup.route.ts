import { Route } from '@angular/router';
import { RoleSetupComponent } from './role-setup.component';
import { PERMISSIONS } from '../../core/const/premissions.const';

export const roleSetupRoute: Route = {
  path: 'role-setup',
  component: RoleSetupComponent,
  data: { breadcrumb: 'Role Setup', permission: PERMISSIONS.roleSetup },
};
