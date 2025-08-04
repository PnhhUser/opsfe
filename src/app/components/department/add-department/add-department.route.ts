import { Route } from '@angular/router';
import { AddDepartmentComponent } from './add-department.component';

export const AddDepartmentRoute: Route = {
  path: 'add-department',
  component: AddDepartmentComponent,
  data: { breadcrumb: 'Add Department' },
};
