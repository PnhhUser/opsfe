import { Route } from '@angular/router';
import { DepartmentComponent } from './department.component';
import { AddDepartmentRoute } from './add-department/add-department.route';

export const departmentRoute: Route = {
  path: 'departments',
  component: DepartmentComponent,
  data: { breadcrumb: 'Departments' },
  children: [AddDepartmentRoute],
};
