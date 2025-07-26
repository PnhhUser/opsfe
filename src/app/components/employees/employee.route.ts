import { Route } from '@angular/router';
import { EmployeeComponent } from './employee.component';

export const employeeRoute: Route = {
  path: 'employees',
  component: EmployeeComponent,
  data: { breadcrumb: 'Employees' },
};
