import { Route } from '@angular/router';
import { RemovePositionComponent } from './remove-position.component';

export const removePositionRoute: Route = {
  path: 'delete-position/:positionId',
  component: RemovePositionComponent,
  data: { breadcrumb: 'Remove Position' },
};
