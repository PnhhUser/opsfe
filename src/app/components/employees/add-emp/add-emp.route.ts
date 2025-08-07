import { Route } from '@angular/router';
import { AddEmpComponent } from './add-emp.component';

export const addEmpRoute: Route = {
  path: 'add-employee',
  component: AddEmpComponent,
  data: { breadcrumb: 'Add Employee' },
};
