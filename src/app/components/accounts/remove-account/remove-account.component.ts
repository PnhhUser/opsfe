import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AccountActions from '../../../store/accounts/account.actions';
import {
  selectAccounts,
  selectAccountsLoading,
} from '../../../store/accounts/account.selectors';
import { distinctUntilChanged, filter, map, Observable, take } from 'rxjs';
import { ILoadAccount } from '../../../core/interfaces/account.interface';

@Component({
  selector: 'app-remove-account',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
  template: `
    <app-confirm-dialog
      *ngIf="showConfirm"
      [visible]="showConfirm"
      [title]="'Xác nhận muốn xóa người dùng'"
      [message]="'Bạn có chắc muốn xóa ' + pendingData?.username + ' không?'"
      [loading]="(loading$ | async) ?? false"
      [loadingText]="'Đang xóa người dùng...'"
      confirmText="Đồng ý"
      cancelText="Hủy bỏ"
      (confirm)="confirm()"
      (cancel)="cancel()"
    ></app-confirm-dialog>
  `,
})
export class RemoveAccountComponent {
  showConfirm = true;
  pendingData: ILoadAccount | null = null;

  loading$: Observable<boolean>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    this.loading$ = this.store.select(selectAccountsLoading);
  }

  ngOnInit() {
    const accountId = this.activatedRoute.snapshot.params?.['accountId'];

    if (!accountId) {
      this.router.navigateByUrl('/module/human-resources/accounts');
      return;
    }

    this.store
      .select(selectAccounts)
      .pipe(
        map((data) => {
          return data
            .filter((v) => v.accountId === Number.parseInt(accountId))
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
      AccountActions.removeAccount({ accountId: this.pendingData.accountId })
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
        this.router.navigateByUrl('/module/human-resources/accounts');
      });
  }

  cancel() {
    this.showConfirm = false;
    this.pendingData = null;

    this.router.navigateByUrl('/module/human-resources/accounts');
  }
}
