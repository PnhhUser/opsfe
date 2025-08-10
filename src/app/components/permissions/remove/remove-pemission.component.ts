import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { ILoadPermissions } from '../../../core/interfaces/permission.interface';
import { distinctUntilChanged, filter, map, Observable, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectDepartmentLoading } from '../../../store/departments/department.selectors';
import { selectPermission } from '../../../store/permission/permission.selector';
import { ActionPermission } from '../../../store/permission/permission.actions';

@Component({
  selector: 'app-remove-permission',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
  template: `<app-confirm-dialog
    *ngIf="showConfirm"
    [visible]="showConfirm"
    [title]="'Xác nhận xóa quyền'"
    [message]="'Bạn có chắc muốn xóa ' + pendingData?.name + ' không?'"
    [loading]="(loading$ | async) ?? false"
    [loadingText]="'Đang xóa quyền...'"
    confirmText="Đồng ý"
    cancelText="Hủy bỏ"
    (confirm)="confirm()"
    (cancel)="cancel()"
  ></app-confirm-dialog>`,
})
export class RemovePermissionComponent {
  showConfirm = true;
  pendingData: ILoadPermissions | null = null;
  loading$: Observable<boolean>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    this.loading$ = this.store.select(selectDepartmentLoading);
  }

  ngOnInit() {
    const departmentId = this.activatedRoute.snapshot.params?.['permissonId'];

    if (!departmentId) {
      this.router.navigateByUrl('/module/access-control/permissions');
      return;
    }

    this.store
      .select(selectPermission)
      .pipe(
        map((data) => {
          return data
            .filter((v) => v.id === Number.parseInt(departmentId))
            .find((v) => v);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.pendingData = data;
        }
      });
  }

  confirm() {
    if (!this.pendingData) return;

    this.store.dispatch(
      ActionPermission.removePermission({
        permissionId: this.pendingData.id,
      })
    );

    // Đợi kết quả xử lý sau khi dispatch
    this.loading$
      .pipe(
        distinctUntilChanged(),
        filter((loading) => loading === false),
        take(1)
      )
      .subscribe(() => {
        this.showConfirm = false;
        this.pendingData = null;
        this.router.navigateByUrl('/module/access-control/permissions');
      });
  }

  cancel() {
    this.showConfirm = false;
    this.pendingData = null;

    this.router.navigateByUrl('/module/access-control/permissions');
  }
}
