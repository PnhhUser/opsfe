import { Route } from '@angular/router';
import { EditPermissionComponent } from './edit-permisson.component';

export const editPermissonRoute: Route = {
  path: 'edit-permission/:permissonId',
  component: EditPermissionComponent,
  data: { breadcrumb: 'Edit Permisson' },
};
