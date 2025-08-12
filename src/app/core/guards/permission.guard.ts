import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  ReplaySubject,
  Subject,
  Subscription,
} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { SetupRoleService } from '../services/setup-role.service';
import { PermissionService } from '../services/permission.service';
import { ToastService } from '../services/toast.service';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import { loadAccount } from '../../store/accounts/account.actions';
import { selectAccounts } from '../../store/accounts/account.selectors';
import { IResponseCustom } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  private permissionMap$ = new ReplaySubject<Map<string, number>>(1);
  private rolePermissionMap$ = new ReplaySubject<Map<string, number>>(1);

  private roleIdSubject = new BehaviorSubject<number | null>(null);
  private destroy$ = new Subject<void>();

  private loadRequest$ = new Subject<void>();
  private currentLoad$: Subscription | null = null;

  constructor(
    private setupRoleService: SetupRoleService,
    private permissionService: PermissionService,
    private router: Router,
    private toastService: ToastService,
    private store: Store
  ) {
    this.store.dispatch(loadAccount());

    // Load global permission map 1 lần và cache lại
    this.permissionService.getPermissions().subscribe({
      next: (res) => {
        const map = new Map<string, number>();
        if (res && res.data) {
          res.data.forEach((p) => map.set(p.key.trim().toLowerCase(), p.id));
        }
        this.permissionMap$.next(map);
      },
      error: () => {
        this.permissionMap$.next(new Map());
      },
    });

    // Giám sát roleId thay đổi để load permission role tương ứng và cache
    // this.getCurrentUserRoleId()
    //   .pipe(take(1))
    //   .subscribe((roleId) => {
    //     console.log(roleId);

    //     this.roleIdSubject.next(roleId);
    //     if (roleId) {
    //       this.loadRolePermissions(roleId);
    //     } else {
    //       this.rolePermissionMap$.next(new Map()); // role null thì map rỗng
    //     }
    //   });

    this.loadRequest$
      .pipe(
        switchMap(() =>
          this.getCurrentUserRoleId().pipe(
            take(1),
            distinctUntilChanged(),
            tap((roleId) => {
              this.roleIdSubject.next(roleId);
            }),
            switchMap((roleId) => {
              if (!roleId) return of(new Map<string, number>());

              // Hủy request đang chờ nếu có
              if (this.currentLoad$) this.currentLoad$.unsubscribe();

              return this.setupRoleService.getPermissionsByRoleId(roleId).pipe(
                map((res) => this.createPermissionMap(res)),
                catchError(() => of(new Map<string, number>()))
              );
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((permissionMap) => {
        this.rolePermissionMap$.next(permissionMap);
      });

    this.loadRequest$.next(); // Trigger initial load
  }

  private createPermissionMap(res: IResponseCustom<any>): Map<string, number> {
    const map = new Map<string, number>();
    if (res?.data) {
      res.data.forEach((p: any) => map.set(p.key.trim().toLowerCase(), p.id));
    }
    return map;
  }

  private loadRolePermissions(roleId: number): void {
    this.setupRoleService.getPermissionsByRoleId(roleId).subscribe({
      next: (res) => {
        const map = new Map<string, number>();
        if (res && res.data) {
          res.data.forEach((p: any) =>
            map.set(p.key.trim().toLowerCase(), p.id)
          );
        }

        this.rolePermissionMap$.next(map);
      },
      error: () => {
        this.rolePermissionMap$.next(new Map());
      },
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const permissionKeyRaw = this.findPermissionKey(route);
    const breadcrumb = this.findBreadcrumb(route);

    if (!permissionKeyRaw) {
      this.toastService.info('Access denied: Missing permission key');
      this.router.navigate(['/not-authorized']);
      return of(false);
    }

    const permissionKey = permissionKeyRaw.trim().toLowerCase();

    return this.permissionMap$.pipe(
      take(1),
      switchMap((globalPermissionMap) => {
        if (!globalPermissionMap.has(permissionKey)) {
          this.toastService.info('Access denied: Permission key invalid');
          this.router.navigate(['/not-authorized']);
          return of(false);
        }

        if (!this.getCurrentRoleId()) {
          this.toastService.info('Access denied: Missing role');
          this.router.navigate(['/not-authorized']);
          return of(false);
        }

        return this.rolePermissionMap$.pipe(
          filter((rolePermissionMap) => rolePermissionMap.size > 0), // chờ dữ liệu role permission load xong
          take(1),
          switchMap((rolePermissionMap) => {
            const permissionId = rolePermissionMap.get(permissionKey) ?? null;

            if (!permissionId) {
              this.toastService.info(
                'Access denied: You do not have permission ' + breadcrumb
              );
              this.router.navigate(['/']);
              return of(false);
            }

            return this.setupRoleService
              .hasPermission(this.getCurrentRoleId()!, permissionId)
              .pipe(
                map((hasPermRes) => {
                  if (hasPermRes.data.hasPermission) {
                    return true;
                  } else {
                    this.toastService.info('Access denied: No permission');
                    this.router.navigate(['/']);
                    return false;
                  }
                }),
                catchError(() => {
                  this.toastService.info('Access denied: An error occurred');
                  this.router.navigate(['/']);
                  return of(false);
                }),
                takeUntil(this.destroy$)
              );
          })
        );
      })
    );
  }

  private getCurrentUserRoleId(): Observable<number | null> {
    return combineLatest([
      this.store.select(selectUser),
      this.store.select(selectAccounts),
    ]).pipe(
      filter(([user, accounts]) => !!user && accounts.length > 0),
      map(
        ([user, accounts]) =>
          accounts.find((acc) => acc.accountId === user?.id)?.roleId ?? null
      ),
      takeUntil(this.destroy$)
    );
  }

  private findPermissionKey(route: ActivatedRouteSnapshot): string | null {
    if (route.firstChild) {
      const childPermission = this.findPermissionKey(route.firstChild);
      if (childPermission) {
        return childPermission;
      }
    }
    if (route.data && route.data['permission']) {
      return route.data['permission'];
    }
    return null;
  }

  private findBreadcrumb(route: ActivatedRouteSnapshot): string | null {
    if (route.firstChild) {
      const childBreadcrumb = this.findBreadcrumb(route.firstChild);
      if (childBreadcrumb) {
        return childBreadcrumb;
      }
    }
    if (route.data && route.data['breadcrumb']) {
      return route.data['breadcrumb'];
    }
    return null;
  }

  private getCurrentRoleId(): number | null {
    return this.roleIdSubject.getValue();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
