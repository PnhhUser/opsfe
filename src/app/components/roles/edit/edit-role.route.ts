import { Route } from '@angular/router';
import { EditRoleComponent } from './edit-role.component';

export const editRoleRoute: Route = {
  path: 'edit-role/:roleId',
  component: EditRoleComponent,
  data: { breadcrumb: 'Edit Role' },
};
