import { Route } from '@angular/router';
import { HumanResourcesComponent } from './human-resources.component';
import { accountRoute } from '../accounts/account.route';
import { employeeRoute } from '../employees/employee.route';
import { positionRoute } from '../position/position.route';
import { departmentRoute } from '../department/department.route';
import { PERMISSIONS } from '../../core/const/premissions.const';

export const humanResourcesRoute: Route = {
  path: 'human-resources',
  component: HumanResourcesComponent,
  data: { breadcrumb: 'HR Management', permission: PERMISSIONS.hr_management },
  children: [accountRoute, employeeRoute, positionRoute, departmentRoute],
};
