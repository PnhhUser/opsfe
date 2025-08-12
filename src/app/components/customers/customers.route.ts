import { Route } from '@angular/router';
import { CustomerManagementComponent } from './customers.component';
import { PERMISSIONS } from '../../core/const/premissions.const';

export const customersManagementRoute: Route = {
  path: 'customers-management',
  component: CustomerManagementComponent,
  data: {
    breadcrumb: 'Customers Management',
    permission: PERMISSIONS.customers_management,
  },
};
