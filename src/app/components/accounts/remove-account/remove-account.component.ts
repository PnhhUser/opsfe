import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IUser } from '../../../core/interfaces/auth.interface';
import { AccountService } from '../../../core/services/account.service';
import * as AccountActions from '../../../store/accounts/account.actions';
import { selectLoading } from '../../../store/accounts/account.selectors';
import { Observable, pairwise, startWith, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-remove-account',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
  template: `<app-confirm-dialog
    *ngIf="showConfirm"
    [message]="'Bạn có chắc muốn xóa ' + pendingData?.name + ' không?'"
    [loading]="isLoading"
    (confirm)="confirm()"
    (cancel)="cancel()"
  ></app-confirm-dialog>`,
})
export class RemoveAccountComponent {
  showConfirm = true;
  isLoading = false;
  pendingData: IUser | null = null;
  hasDispatched = false;

  loading$: Observable<boolean>;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private store: Store
  ) {
    this.loading$ = this.store.select(selectLoading);
  }

  ngOnInit() {
    const accountId = this.activatedRoute.snapshot.params?.['accountId'];

    if (!accountId) {
      this.router.navigateByUrl('/module/human-resources/accounts');
      return;
    }

    this.accountService.getAccount(Number.parseInt(accountId)).subscribe({
      next: (res) => {
        const raw = res.data;

        this.pendingData = {
          id: raw.accountId,
          name: raw.username,
        };
      },
      error: (err) => {
        this.router.navigateByUrl('/module/human-resources/accounts');
      },
    });

    this.loading$
      .pipe(startWith(false), pairwise(), takeUntil(this.destroy$))
      .subscribe(([prev, curr]) => {
        if (!this.hasDispatched) return;

        // Chờ 2 giây rồi mới đóng dialog và redirect
        setTimeout(() => {
          this.showConfirm = false;
          this.pendingData = null;
          this.router.navigateByUrl('/module/human-resources/accounts');
        }, 2000);
      });
  }

  confirm() {
    if (!this.pendingData) return;
    this.hasDispatched = true;
    this.isLoading = true;

    this.store.dispatch(
      AccountActions.removeAccount({ accountId: this.pendingData.id })
    );
  }

  cancel() {
    this.showConfirm = false;
    this.isLoading = false;

    this.router.navigateByUrl('/module/human-resources/accounts');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
