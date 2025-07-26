import { Route } from '@angular/router';
import { DepartmentComponent } from './department.component';

export const departmentRoute: Route = {
  path: 'departments',
  component: DepartmentComponent,
  data: { breadcrumb: 'Departments' },
};
