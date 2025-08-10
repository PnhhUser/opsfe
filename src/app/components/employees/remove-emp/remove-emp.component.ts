import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { ILoadEmployee } from '../../../core/interfaces/employee.interface';
import { distinctUntilChanged, filter, map, Observable, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectEmpLoading,
  selectEmps,
} from '../../../store/employees/employee.selectors';
import { ActionEmployee } from '../../../store/employees/employee.actions';

@Component({
  selector: 'app-remove-emp',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
  template: `<app-confirm-dialog
    *ngIf="showConfirm"
    [visible]="showConfirm"
    [title]="'Xác nhận xóa nhân viên'"
    [message]="
      'Bạn có chắc muốn thêm nhân viên ' + pendingData?.fullName + ' không?'
    "
    [loading]="(loading$ | async) ?? false"
    [loadingText]="'Đang thêm nhân viên...'"
    confirmText="Đồng ý"
    cancelText="Hủy bỏ"
    (confirm)="confirm()"
    (cancel)="cancel()"
  ></app-confirm-dialog>`,
})
export class RemoveEmpComponent {
  showConfirm = true;
  pendingData: ILoadEmployee | null = null;
  loading$: Observable<boolean>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    this.loading$ = this.store.select(selectEmpLoading);
  }

  ngOnInit() {
    const employeeId = this.activatedRoute.snapshot.params?.['employeeId'];

    if (!employeeId) {
      this.router.navigateByUrl('/module/human-resources/employees');
      return;
    }

    this.store
      .select(selectEmps)
      .pipe(
        map((data) => {
          return data
            .filter((v) => v.employeeId === Number.parseInt(employeeId))
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
      ActionEmployee.removeEmployee({
        employeeId: this.pendingData.employeeId,
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
        this.router.navigateByUrl('/module/human-resources/employees');
      });
  }

  cancel() {
    this.showConfirm = false;
    this.pendingData = null;

    this.router.navigateByUrl('/module/human-resources/employees');
  }
}
