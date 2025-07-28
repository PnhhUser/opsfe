import { Route } from '@angular/router';
import { RemoveAccountComponent } from './remove-account.component';

export const RemoveAccountRoute: Route = {
  path: 'delete-account/:accountId',
  component: RemoveAccountComponent,
  data: {
    breadcrumb: 'Remove account',
  },
};
