import { Route } from '@angular/router';
import { EditDepartmentComponent } from './edit-department.component';

export const EditDepartmentRoute: Route = {
  path: 'edit-department/:departmentId',
  component: EditDepartmentComponent,
  data: { breadcrumb: 'Edit Department' },
};
