import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PanelComponent } from '../../shared/components/panel/panel.component';
import { ButtonLinkComponent } from '../../shared/components/button-link/button-link.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import {
  combineLatest,
  Subject,
  takeUntil,
  filter,
  map,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { selectAccounts } from '../../store/accounts/account.selectors';
import { loadAccount } from '../../store/accounts/account.actions';
import { ActionPermission } from '../../store/permission/permission.actions';
import { selectPermission } from '../../store/permission/permission.selector';
import { SetupRoleService } from '../../core/services/setup-role.service';
import { IPermission } from '../../core/interfaces/permission.interface';
import { PERMISSIONS } from '../../core/const/premissions.const';

interface AppRoute {
  name: string;
  url: string;
  isDisabled: boolean;
  code?: string;
}

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  standalone: true,
  imports: [CommonModule, ButtonLinkComponent, PanelComponent, RouterOutlet],
})
export class ModuleComponent {
  routes: AppRoute[] = [
    {
      name: 'HR Management',
      url: 'human-resources',
      isDisabled: false,
      code: PERMISSIONS.hr_management,
    },
    {
      name: 'Access Control',
      url: 'access-control',
      isDisabled: false,
      code: PERMISSIONS.access_control,
    },
    {
      name: 'Customers Management',
      url: 'customers-management',
      isDisabled: false,
      code: PERMISSIONS.customers_management,
    },
    {
      name: 'Storagies',
      url: 'storagies',
      isDisabled: false,
      code: PERMISSIONS.storagies,
    },
  ];

  destroy$ = new Subject<void>();

  permissions: string[] = [];

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private setupRoleService: SetupRoleService
  ) {}

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

  ngDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
