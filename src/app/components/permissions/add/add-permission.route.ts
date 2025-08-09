import { Route } from '@angular/router';
import { AddPermissionComponent } from './add-permisson.component';

export const addPermissionRoute: Route = {
  path: 'add-permission',
  component: AddPermissionComponent,
  data: { breadcrumb: 'Add Permission' },
};
