import { Route } from '@angular/router';
import { StoragiesComponent } from './storagies.component';

export const storagiesRoute: Route = {
  path: 'storagies',
  component: StoragiesComponent,
  data: { breadcrumb: 'Storagies' },
};
