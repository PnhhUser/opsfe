import { Route } from '@angular/router';
import { RemoveRoleComponent } from './remove-role.component';

export const removeRoleRoute: Route = {
  path: 'delete-role/:roleId',
  component: RemoveRoleComponent,
  data: { breadcrumb: 'Remove Role' },
};
