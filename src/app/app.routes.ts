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
      // dashboard
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { breadcrumb: 'Dashboard' },
      },
      // analytics
      {
        path: 'analytics',
        component: AnalyticsComponent,
        data: { breadcrumb: 'Analytics' },
      },
      // module
      {
        path: 'module',
        component: ModuleComponent,
        data: { breadcrumb: 'Business Modules' },
        children: [
          // human-resources
          {
            path: 'human-resources',
            loadComponent: () =>
              import(
                './components/human-resources/human-resources.component'
              ).then((m) => m.HumanResourcesComponent),
            data: { breadcrumb: 'HR Management' },
            children: [
              // accounts
              {
                path: 'accounts',
                loadComponent: () =>
                  import('./components/accounts/accounts.component').then(
                    (m) => m.AccountComponent
                  ),
                data: { breadcrumb: 'Accounts' },
              },
              // employees
              {
                path: 'employees',
                loadComponent: () =>
                  import('./components/employees/employee.component').then(
                    (m) => m.EmployeeComponent
                  ),
                data: { breadcrumb: 'Employees' },
              },
              // positions
              {
                path: 'positions',
                loadComponent: () =>
                  import('./components/position/position.component').then(
                    (m) => m.PositionComponent
                  ),
                data: { breadcrumb: 'Positions' },
              },
              // departments
              {
                path: 'departments',
                loadComponent: () =>
                  import('./components/department/department.component').then(
                    (m) => m.DepartmentComponent
                  ),
                data: { breadcrumb: 'Departments' },
              },
            ],
          },
        ],
      },
      // setting
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
