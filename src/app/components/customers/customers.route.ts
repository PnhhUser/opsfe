import { Route } from '@angular/router';
import { CustomerManagementComponent } from './customers.component';

export const customersManagementRoute: Route = {
  path: 'customers-management',
  component: CustomerManagementComponent,
  data: { breadcrumb: 'Customers Management' },
};
