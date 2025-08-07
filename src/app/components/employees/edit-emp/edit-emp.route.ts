import { Route } from '@angular/router';
import { EditEmpComponent } from './edit-emp.component';

export const editEmpRoute: Route = {
  path: 'edit-employee/:employeeId',
  component: EditEmpComponent,
  data: { breadcrumb: 'Edit Employee' },
};
