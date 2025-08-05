import { Route } from '@angular/router';
import { AddPositionComponent } from './add-position.component';

export const addPositionRoute: Route = {
  path: 'add-position',
  component: AddPositionComponent,
  data: { breadcrumb: 'Add Position' },
};
