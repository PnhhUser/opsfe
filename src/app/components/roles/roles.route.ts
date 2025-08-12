import { Route } from '@angular/router';
import { RolesComponent } from './roles.component';
import { addRoleRoute } from './add/add-role.route';
import { editRoleRoute } from './edit/edit-role.route';
import { removeRoleRoute } from './remove/remove-role.route';
import { PERMISSIONS } from '../../core/const/premissions.const';

export const rolesRoute: Route = {
  path: 'roles',
  component: RolesComponent,
  data: { breadcrumb: 'Roles', permission: PERMISSIONS.roles },
  children: [addRoleRoute, editRoleRoute, removeRoleRoute],
};
