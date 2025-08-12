import { Route } from '@angular/router';
import { DepartmentComponent } from './department.component';
import { AddDepartmentRoute } from './add-department/add-department.route';
import { EditDepartmentRoute } from './edit-department/edit-department.route';
import { RemoveDepartmentRoute } from './remove-department/remove-department.route';
import { PERMISSIONS } from '../../core/const/premissions.const';

export const departmentRoute: Route = {
  path: 'departments',
  component: DepartmentComponent,
  data: { breadcrumb: 'Departments', permission: PERMISSIONS.departments },
  children: [AddDepartmentRoute, EditDepartmentRoute, RemoveDepartmentRoute],
};
