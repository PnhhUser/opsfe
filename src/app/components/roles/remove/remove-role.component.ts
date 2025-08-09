import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { ILoadRoles } from '../../../core/interfaces/role.interface';
import { distinctUntilChanged, filter, map, Observable, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectRoles,
  selectRolesLoading,
} from '../../../store/role/role.selector';
import { ActionRole } from '../../../store/role/role.actions';

@Component({
  selector: 'app-remove-role',
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
export class RemoveRoleComponent {
  showConfirm = true;
  pendingData: ILoadRoles | null = null;
  loading$: Observable<boolean>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    this.loading$ = this.store.select(selectRolesLoading);
  }

  ngOnInit() {
    const roleId = this.activatedRoute.snapshot.params?.['roleId'];

    if (!roleId) {
      this.router.navigateByUrl('/module/access-control/roles');
      return;
    }

    this.store
      .select(selectRoles)
      .pipe(
        map((data) => {
          return data
            .filter((v) => v.id === Number.parseInt(roleId))
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
      ActionRole.removeRole({
        roleId: this.pendingData.id,
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
        this.router.navigateByUrl('/module/access-control/roles');
      });
  }

  cancel() {
    this.showConfirm = false;
    this.pendingData = null;

    this.router.navigateByUrl('/module/access-control/roles');
  }
}
