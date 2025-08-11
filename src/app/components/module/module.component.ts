import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PanelComponent } from '../../shared/components/panel/panel.component';
import { ButtonLinkComponent } from '../../shared/components/button-link/button-link.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import { combineLatest, Subject, takeUntil, filter, map } from 'rxjs';
import { selectAccounts } from '../../store/accounts/account.selectors';
import { loadAccount } from '../../store/accounts/account.actions';
import { ActionPermission } from '../../store/permission/permission.actions';
import { selectPermission } from '../../store/permission/permission.selector';
import { SetupRoleService } from '../../core/services/setup-role.service';
import { IPermission } from '../../core/interfaces/permission.interface';

interface AppRoute {
  name: string;
  url: string;
  isDisabled: boolean;
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
    },
    {
      name: 'Access Control',
      url: 'access-control',
      isDisabled: false,
    },
    {
      name: 'Customers Management',
      url: 'customers-management',
      isDisabled: false,
    },
    {
      name: 'Storagies',
      url: 'storagies',
      isDisabled: false,
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
        filter(
          ([_, accounts, permissions]) =>
            accounts.length > 0 && permissions.length > 0
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([user, accounts, permissions]) => {
        const currentUser = accounts.filter(
          (account) => account.accountId === user?.id
        );

        const roleId = currentUser[0]?.roleId;

        this.permissions = [...permissions.map((p) => p.key)];

        this.setupRoleService
          .getPermissionsByRoleId(roleId)
          .subscribe((res) => {
            let permissions: IPermission[] = res.data;

            permissions = permissions.filter((item) =>
              this.routes.some((r) => r.name === item.name)
            );

            this.routes = this.routes.map((route) => {
              const permission = permissions.find((p) => p.name === route.name);
              return {
                ...route,
                isDisabled: !permission,
              };
            });
          });
      });
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
