import { Route } from '@angular/router';
import { AccountComponent } from './accounts.component';
import { addAccountRoute } from './add-account/add-account.route';
import { editAccountRoute } from './edit-account/edit-account.route';

export const accountRoute: Route = {
  path: 'accounts',
  component: AccountComponent,
  data: { breadcrumb: 'Accounts' },
  children: [addAccountRoute, editAccountRoute],
};
