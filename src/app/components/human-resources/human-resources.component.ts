import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PanelComponent } from '../../shared/components/panel/panel.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ButtonLinkComponent } from '../../shared/components/button-link/button-link.component';
import { Store } from '@ngrx/store';
import { SetupRoleService } from '../../core/services/setup-role.service';
import { loadAccount } from '../../store/accounts/account.actions';
import { ActionPermission } from '../../store/permission/permission.actions';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { selectUser } from '../../store/auth/auth.selectors';
import { selectAccounts } from '../../store/accounts/account.selectors';
import { selectPermission } from '../../store/permission/permission.selector';
import { IPermission } from '../../core/interfaces/permission.interface';

interface AppRoute {
  name: string;
  url: string;
  isDisabled: boolean;
  code?: string;
}

@Component({
  selector: 'app-human-resources',
  standalone: true,
  templateUrl: './human-resources.component.html',
  imports: [CommonModule, PanelComponent, ButtonLinkComponent, RouterOutlet],
})
export class HumanResourcesComponent {
  parentLabel = 'Back';

  routes: AppRoute[] = [
    {
      name: 'Accounts',
      url: 'accounts',
      isDisabled: false,
      code: 'view.accounts',
    },
    {
      name: 'Employees',
      url: 'employees',
      isDisabled: false,
      code: 'view.employees',
    },
    {
      name: 'Positions',
      url: 'positions',
      isDisabled: false,
      code: 'view.positions',
    },
    {
      name: 'Departments',
      url: 'departments',
      isDisabled: false,
      code: 'view.departments',
    },
  ];

  destroy$ = new Subject<void>();

  permissions: string[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private setupRoleService: SetupRoleService
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : 'Back';
  }

  ngOnInit() {
    this.store.dispatch(loadAccount());
    this.store.dispatch(ActionPermission.loadPermissions());

    combineLatest([
      this.store.select(selectUser),
      this.store.select(selectAccounts),
      this.store.select(selectPermission),
    ])
      .pipe(
        // Chỉ chạy khi có account và permission
        filter(
          ([_, accounts, permissions]) =>
            accounts.length > 0 && permissions.length > 0
        ),
        map(([user, accounts, permissions]) => {
          const currentUser = accounts.find(
            (account) => account.accountId === user?.id
          );
          return { roleId: currentUser?.roleId ?? null, permissions };
        }),
        // Chặn roleId null hoặc undefined
        filter(({ roleId }) => roleId !== null && roleId !== undefined),
        distinctUntilChanged((prev, curr) => prev.roleId === curr.roleId),
        switchMap(({ roleId, permissions }) => {
          this.permissions = permissions.map((p) => p.key);

          return this.setupRoleService.getPermissionsByRoleId(roleId!).pipe(
            map((res) => res.data),
            map((rolePermissions: IPermission[]) => {
              const validPermissions = rolePermissions.filter((item) =>
                this.routes.some((r) => r.code === item.key)
              );

              this.routes = this.routes.map((route) => ({
                ...route,
                isDisabled: !validPermissions.some((p) => p.key === route.code),
              }));
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  isParentRoute(): boolean {
    const currentRoute = this.activatedRoute;
    return !currentRoute.firstChild;
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
