import { Route } from '@angular/router';
import { EmployeeComponent } from './employee.component';
import { addEmpRoute } from './add-emp/add-emp.route';
import { editEmpRoute } from './edit-emp/edit-emp.route';
import { removeEmpRoute } from './remove-emp/remove-emp.route';
import { PERMISSIONS } from '../../core/const/premissions.const';

export const employeeRoute: Route = {
  path: 'employees',
  component: EmployeeComponent,
  data: { breadcrumb: 'Employees', permission: PERMISSIONS.employees },
  children: [addEmpRoute, editEmpRoute, removeEmpRoute],
};
