import { Route } from '@angular/router';
import { SettingComponent } from './setting.component';
import { PERMISSIONS } from '../../core/const/premissions.const';

export const settingRoute: Route = {
  path: 'setting',
  component: SettingComponent,
  data: { breadcrumb: 'Setting', permission: PERMISSIONS.settings },
};
