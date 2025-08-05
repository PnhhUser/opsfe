import { Route } from '@angular/router';
import { RemoveDepartmentComponent } from './remove-department.component';

export const RemoveDepartmentRoute: Route = {
  path: 'delete-department/:departmentId',
  component: RemoveDepartmentComponent,
  data: { breadcrumb: 'Remove Department' },
};
