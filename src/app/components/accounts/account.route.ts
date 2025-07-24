import { Route } from '@angular/router';
import { AccountComponent } from './accounts.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';

export const accountRoute: Route = {
  path: 'accounts',
  component: AccountComponent,
  data: { breadcrumb: 'Accounts' },
  children: [
    // add
    {
      path: 'add-account',
      component: AddAccountComponent,
      data: { breadcrumb: 'Add Account' },
    },
    // edit
    {
      path: 'edit-account/:accountId',
      component: EditAccountComponent,
      data: { breadcrumb: 'Edit Account' },
    },
  ],
};
