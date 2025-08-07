import { Route } from '@angular/router';
import { EmployeeComponent } from './employee.component';
import { addEmpRoute } from './add-emp/add-emp.route';
import { editEmpRoute } from './edit-emp/edit-emp.route';
import { removeEmpRoute } from './remove-emp/remove-emp.route';

export const employeeRoute: Route = {
  path: 'employees',
  component: EmployeeComponent,
  data: { breadcrumb: 'Employees' },
  children: [addEmpRoute, editEmpRoute, removeEmpRoute],
};
