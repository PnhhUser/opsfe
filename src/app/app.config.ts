import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { accountReducer } from './store/accounts/account.reducer';
import { AccountEffect } from './store/accounts/account.effects';
import { departmentReducer } from './store/departments/department.reducer';
import { DepartmentEffect } from './store/departments/department.effects';
import { positionReducer } from './store/positions/position.reducer';
import { PositionEffect } from './store/positions/position.effects';
import { employeeReducer } from './store/employees/employee.reducer';
import { EmployeeEffect } from './store/employees/employee.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideStore({
      auth: authReducer,
      account: accountReducer,
      department: departmentReducer,
      position: positionReducer,
      employee: employeeReducer,
    }),
    provideEffects([
      AuthEffects,
      AccountEffect,
      DepartmentEffect,
      PositionEffect,
      EmployeeEffect,
    ]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
};
