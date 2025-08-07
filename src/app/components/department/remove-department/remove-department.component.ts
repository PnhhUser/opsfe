import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  pairwise,
  take,
} from 'rxjs';
import { IloadDepartment } from '../../../core/interfaces/department.interface';
import {
  selectDepartmentLoading,
  selectDepartments,
} from '../../../store/departments/department.selectors';
import { ActionDepartment } from '../../../store/departments/department.actions';

@Component({
  selector: 'app-remove-department',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
  template: `<app-confirm-dialog
    *ngIf="showConfirm"
    [message]="'Bạn có chắc muốn xóa ' + pendingData?.name + ' không?'"
    [loading]="(loading$ | async) ?? false"
    (confirm)="confirm()"
    (cancel)="cancel()"
  ></app-confirm-dialog>`,
})
export class RemoveDepartmentComponent {
  showConfirm = true;
  pendingData: IloadDepartment | null = null;
  loading$: Observable<boolean>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    this.loading$ = this.store.select(selectDepartmentLoading);
  }

  ngOnInit() {
    const departmentId = this.activatedRoute.snapshot.params?.['departmentId'];

    if (!departmentId) {
      this.router.navigateByUrl('/module/human-resources/departments');
      return;
    }

    this.store
      .select(selectDepartments)
      .pipe(
        map((data) => {
          return data
            .filter((v) => v.departmentId === Number.parseInt(departmentId))
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
      ActionDepartment.removeDepartment({
        departmentId: this.pendingData.departmentId,
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
        this.router.navigateByUrl('/module/human-resources/departments');
      });
  }

  cancel() {
    this.showConfirm = false;
    this.pendingData = null;

    this.router.navigateByUrl('/module/human-resources/departments');
  }
}
