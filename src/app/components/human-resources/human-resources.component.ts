import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PanelComponent } from '../../shared/components/panel/panel.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ButtonLinkComponent } from '../../shared/components/button-link/button-link.component';
import { Store } from '@ngrx/store';
import { SetupRoleService } from '../../core/services/setup-role.service';
import { loadAccount } from '../../store/accounts/account.actions';
import { ActionPermission } from '../../store/permission/permission.actions';
import { combineLatest, filter, Subject, takeUntil } from 'rxjs';
import { selectUser } from '../../store/auth/auth.selectors';
import { selectAccounts } from '../../store/accounts/account.selectors';
import { selectPermission } from '../../store/permission/permission.selector';
import { IPermission } from '../../core/interfaces/permission.interface';

interface AppRoute {
  name: string;
  url: string;
  isDisabled: boolean;
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
    },
    {
      name: 'Employees',
      url: 'employees',
      isDisabled: false,
    },
    {
      name: 'Positions',
      url: 'positions',
      isDisabled: false,
    },
    {
      name: 'Departments',
      url: 'departments',
      isDisabled: false,
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

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
