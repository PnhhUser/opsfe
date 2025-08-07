import { Route } from '@angular/router';
import { RemoveEmpComponent } from './remove-emp.component';

export const removeEmpRoute: Route = {
  path: 'delete-employee/:employeeId',
  component: RemoveEmpComponent,
  data: { breadcrumb: 'Delete Employee' },
};
