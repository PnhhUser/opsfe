import { Route } from '@angular/router';
import { AddRoleComponent } from './add-role.component';

export const addRoleRoute: Route = {
  path: 'add-role',
  component: AddRoleComponent,
  data: { breadcrumb: 'Add Role' },
};
