import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { ModuleComponent } from './components/module/module.component';
import { SettingComponent } from './components/setting/setting.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'analytics',
        component: AnalyticsComponent,
        data: { breadcrumb: 'Analytics' },
      },
      {
        path: 'module',
        component: ModuleComponent,
        data: { breadcrumb: 'Module' },
      },
      {
        path: 'setting',
        component: SettingComponent,
        data: { breadcrumb: 'Setting' },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
