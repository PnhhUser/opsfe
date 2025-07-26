import { Route } from '@angular/router';
import { SettingComponent } from './setting.component';

export const settingRoute: Route = {
  path: 'setting',
  component: SettingComponent,
  data: { breadcrumb: 'Setting' },
};
