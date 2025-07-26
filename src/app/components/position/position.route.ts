import { Route } from '@angular/router';
import { PositionComponent } from './position.component';

export const positionRoute: Route = {
  path: 'positions',
  component: PositionComponent,
  data: { breadcrumb: 'Positions' },
};
