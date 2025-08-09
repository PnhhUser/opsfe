import { Route } from '@angular/router';
import { RemovePermissionComponent } from './remove-pemission.component';

export const removePermissonRoute: Route = {
  path: 'delete-permission/:permissonId',
  component: RemovePermissionComponent,
  data: { breadcrumb: 'Remove Permisson' },
};
