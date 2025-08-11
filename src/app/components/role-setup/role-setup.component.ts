import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { delay, Subject, takeUntil, tap } from 'rxjs';
import { selectRoles } from '../../store/role/role.selector';
import { selectPermission } from '../../store/permission/permission.selector';
import { ActionRole } from '../../store/role/role.actions';
import { ActionPermission } from '../../store/permission/permission.actions';
import {
  LucideAngularModule,
  LUCIDE_ICONS,
  LucideIconProvider,
  Check,
  X,
  ChevronsRight,
  ChevronRight,
  ChevronsLeft,
  ChevronLeft,
} from 'lucide-angular';
import { SetupRoleService } from '../../core/services/setup-role.service';
import { ConfirmDialogComponent } from '../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../core/services/toast.service';

interface rolesColumn {
  itemId: number;
  key: string;
  selected: boolean;
}

interface permissionsColumn extends rolesColumn {
  roleId: number;
}

type SavesRecord = Record<
  number, // roleId
  {
    permissionIds: number[];
  }
>;

@Component({
  selector: 'app-role-setup',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ConfirmDialogComponent],
  templateUrl: './role-setup.component.html',
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        Check,
        X,
        ChevronsRight,
        ChevronRight,
        ChevronsLeft,
        ChevronLeft,
      }),
    },
  ],
})
export class RoleSetupComponent implements OnInit, OnDestroy {
  parentLabel: string = 'Back';

  destroy$ = new Subject<void>();

  roles: rolesColumn[] = [];
  permissions: permissionsColumn[] = [];
  granted: permissionsColumn[] = [];

  hasNextColumn = false;

  originalRoleSetup: any; // Dữ liệu ban đầu để so sánh
  currentRoleSetup: any; // Dữ liệu hiện tại từ form hoặc localStorage
  showConfirm: boolean = false;
  loading: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private setupRoleService: SetupRoleService,
    private toastService: ToastService
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : 'Back';

    // Roles stream
    this.store
      .select(selectRoles)
      .pipe(
        tap((roles) => {
          this.roles = roles.map((role) => ({
            ...role,
            selected: false,
            itemId: role.id,
          }));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    // load local ban đầu
    this.originalRoleSetup = this.loadSaves();
  }

  ngOnInit() {
    // Load data
    this.store.dispatch(ActionRole.loadRoles());
    this.store.dispatch(ActionPermission.loadPermissions());
  }

  isParentRoute(): boolean {
    return !this.activatedRoute.firstChild;
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  submit() {
    this.currentRoleSetup = this.loadSaves();

    if (
      JSON.stringify(this.currentRoleSetup) !==
      JSON.stringify(this.originalRoleSetup)
    ) {
      this.showConfirm = true;
    } else {
      this.toastService.info('No changes detected', 'System');
    }
  }

  confirm() {
    this.loading = true;

    let roleIds = Object.keys(this.currentRoleSetup).map(Number);

    roleIds.forEach((roleId) => {
      this.setupRoleService
        .setRolePermissions({
          roleId,
          permissionIds: this.currentRoleSetup[roleId].permissionIds,
        })
        .pipe(delay(100), takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.showConfirm = false;
            this.toastService.success(
              'Role permissions updated successfully',
              'system'
            );
          },
          error: (err) => {
            this.loading = false;
          },
        });
    });
  }

  cancel() {
    this.loading = true;
    this.showConfirm = false;
  }

  selectItemRole(item: rolesColumn) {
    item.selected = !item.selected;
    this.hasNextColumn = item.selected;

    this.roles
      .filter((role) => role.itemId !== item.itemId)
      .forEach((role) => {
        role.selected = false;
      });

    if (item.selected) {
      // Khi chọn role, gọi API lấy permissions role đó
      this.setupRoleService.getPermissionsByRoleId(item.itemId).subscribe({
        next: (response) => {
          const permissionIds: number[] =
            response.data?.map((p: any) => p.id) || [];

          // Lấy dữ liệu cũ trong localStorage
          let saves: SavesRecord = this.loadSaves();

          // Cập nhật permissionIds cho role hiện tại
          saves[item.itemId] = {
            permissionIds,
            // grantIds: [], // bạn có thể cập nhật grantIds nếu cần
          };

          this.saveSaves(saves);

          // Cập nhật UI dựa trên dữ liệu mới
          this.permissionsColumn(item.itemId);
        },
        error: (err) => {
          console.error('Failed to load permissions by role:', err);
        },
      });
    } else {
      // Nếu bỏ chọn role thì reset permissions
      this.permissions = [];
      this.granted = [];

      // Cập nhật localStorage để xóa dữ liệu role này
      let saves: SavesRecord = this.loadSaves();
      delete saves[item.itemId];
      this.saveSaves(saves);
    }
  }

  permissionsColumn(roleId: number) {
    let savedData: SavesRecord = this.loadSaves();

    this.store
      .select(selectPermission)
      .pipe(
        tap((permission) => {
          this.permissions = permission.map(
            (perm) => ({
              ...perm,
              roleId,
              selected:
                savedData[roleId]?.permissionIds.includes(perm.id) || false,
              itemId: perm.id,
            }),
            takeUntil(this.destroy$)
          );

          // Khôi phục granted từ permissionIds đã lưu
          this.granted = this.permissions
            .filter((p) => p.selected)
            .map((p) => ({
              ...p,
              selected: false,
            }));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  selectItemPermission(item: permissionsColumn) {
    if (this.granted.some((g) => g.itemId === item.itemId)) {
      item.selected = true;
    } else {
      item.selected = !item.selected;
    }
  }

  selectItemGranted(item: permissionsColumn) {
    item.selected = !item.selected;
  }

  btnSelect(items: permissionsColumn[]) {
    this.granted = items
      .filter((item) => item.selected)
      .map((item) => ({
        ...item,
        selected: false,
      }));

    let saves: SavesRecord = this.loadSaves();

    let item = items.find((item) => item);

    if (item && item.roleId) {
      saves[item.roleId] = {
        permissionIds: [...this.granted.map((g) => g.itemId)],
        // grantIds: [],
      };
    }

    this.saveSaves(saves);
  }

  btnSelectAll(items: permissionsColumn[]) {
    // Chọn tất cả permissions
    this.permissions = this.permissions.map((item) => ({
      ...item,
      selected: true,
    }));

    // Cập nhật granted với tất cả permissions
    this.granted = this.permissions.map((item) => ({
      ...item,
      selected: false,
    }));

    this.granted.forEach((item) => {
      if (item.roleId) {
        const saves: SavesRecord = this.loadSaves();
        saves[item.roleId] = {
          permissionIds: this.permissions.map((p) => p.itemId),
          // grantIds: [...this.granted.map((g) => g.itemId)],
        };
        this.saveSaves(saves);
      }
    });
  }

  btnRemove(items: permissionsColumn[]) {
    const itemsToRemove = items.filter((item) => item.selected);
    const roleId = items[0]?.roleId;

    // Cập nhật granted - loại bỏ các item đã chọn
    this.granted = this.granted.filter(
      (grantedItem) =>
        !itemsToRemove.some(
          (toRemove) => toRemove.itemId === grantedItem.itemId
        )
    );

    // Cập nhật trạng thái selected trong permissions
    this.permissions = this.permissions.map((item) => {
      if (itemsToRemove.some((toRemove) => toRemove.itemId === item.itemId)) {
        return { ...item, selected: false };
      }
      return item;
    });

    this.granted.forEach((item) => {
      if (item.roleId) {
        const saves: SavesRecord = this.loadSaves();

        saves[item.roleId] = {
          permissionIds: [...this.granted.map((g) => g.itemId)],
        };

        this.saveSaves(saves);
      }
    });
  }

  btnRemoveAll(items: permissionsColumn[]) {
    const roleId = items[0]?.roleId;

    // Reset tất cả
    this.permissions = this.permissions.map((item) => ({
      ...item,
      selected: false,
    }));
    this.granted = [];

    // Lưu vào localStorage
    if (roleId) {
      const saves: SavesRecord = this.loadSaves();
      saves[roleId] = {
        permissionIds: [],
        // grantIds: [],
      };
      this.saveSaves(saves);
    }
  }

  private loadSaves(): SavesRecord {
    return JSON.parse(localStorage.getItem('roleSetup') || '{}');
  }

  private saveSaves(saves: SavesRecord) {
    localStorage.setItem('roleSetup', JSON.stringify(saves));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
