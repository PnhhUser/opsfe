import { Route } from '@angular/router';
import { StoragiesComponent } from './storagies.component';
import { PERMISSIONS } from '../../core/const/premissions.const';

export const storagiesRoute: Route = {
  path: 'storagies',
  component: StoragiesComponent,
  data: { breadcrumb: 'Storagies', permission: PERMISSIONS.storagies },
};
