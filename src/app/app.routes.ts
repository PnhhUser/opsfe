import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { analyticsRoute } from './components/analytics/analytics.route';
import { dashboardRoute } from './components/dashboard/dashboard.route';
import { settingRoute } from './components/setting/setting.route';
import { loginRoute } from './components/login/login.route';
import { moduleRoute } from './components/module/module.route';
import { PermissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
  loginRoute,
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard, PermissionGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      dashboardRoute,
      analyticsRoute,
      moduleRoute,
      settingRoute,
    ],
    runGuardsAndResolvers: 'always',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
