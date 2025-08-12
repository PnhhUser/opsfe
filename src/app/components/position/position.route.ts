import { Route } from '@angular/router';
import { PositionComponent } from './position.component';
import { addPositionRoute } from './add-position/add-position.route';
import { removePositionRoute } from './remove-position/remove.position.route';
import { editPositionRoute } from './edit-position/edit-position.route';
import { PERMISSIONS } from '../../core/const/premissions.const';

export const positionRoute: Route = {
  path: 'positions',
  component: PositionComponent,
  data: { breadcrumb: 'Positions', permission: PERMISSIONS.positions },
  children: [addPositionRoute, removePositionRoute, editPositionRoute],
};
