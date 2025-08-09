import { Route } from '@angular/router';
import { PermissionsComponent } from './permissions.component';
import { addPermissionRoute } from './add/add-permission.route';
import { editPermissonRoute } from './edit/edit-permisson.route';
import { removePermissonRoute } from './remove/remove-permission.route';

export const permissionsRoute: Route = {
  path: 'permissions',
  component: PermissionsComponent,
  data: { breadcrumb: 'Permissions' },
  children: [addPermissionRoute, editPermissonRoute, removePermissonRoute],
};
