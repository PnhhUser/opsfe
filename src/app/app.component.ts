import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth/auth.actions';
import { loadAccount } from './store/accounts/account.actions';
import { ActionDepartment } from './store/departments/department.actions';
import { ActionEmployee } from './store/employees/employee.actions';
import { ActionPermission } from './store/permission/permission.actions';
import { ActionRole } from './store/role/role.actions';
import { ActionPosition } from './store/positions/position.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class AppComponent {
  constructor(private store: Store) {}

  ngOnInit(): void {
    const hasLogin = localStorage.getItem('hasLogin');

    if (hasLogin) {
      this.store.dispatch(AuthActions.checkAuth());
      this.store.dispatch(loadAccount());
      this.store.dispatch(ActionDepartment.loadDepartments());
      this.store.dispatch(ActionEmployee.loadEmployees());
      this.store.dispatch(ActionPermission.loadPermissions());
      this.store.dispatch(ActionRole.loadRoles());
      this.store.dispatch(ActionPosition.loadPositions());
    }
  }
}
