import { Route } from '@angular/router';
import { RoleSetupComponent } from './role-setup.component';

export const roleSetupRoute: Route = {
  path: 'role-setup',
  component: RoleSetupComponent,
  data: { breadcrumb: 'Role Setup' },
};
