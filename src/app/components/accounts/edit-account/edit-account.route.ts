import { Route } from '@angular/router';
import { EditAccountComponent } from './edit-account.component';

export const editAccountRoute: Route = {
  path: 'edit-account/:accountId',
  component: EditAccountComponent,
  data: { breadcrumb: 'Edit Account' },
};
