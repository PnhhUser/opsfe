import { Route } from '@angular/router';
import { AddAccountComponent } from './add-account.component';

export const addAccountRoute: Route = {
  path: 'add-account',
  component: AddAccountComponent,
  data: { breadcrumb: 'Add Account' },
};
