import { Route } from '@angular/router';
import { EditPositionComponent } from './edit-position.component';

export const editPositionRoute: Route = {
  path: 'edit-position/:positionId',
  component: EditPositionComponent,
  data: { breadcrumb: 'Edit Position' },
};
