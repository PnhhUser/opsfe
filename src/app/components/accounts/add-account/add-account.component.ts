import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { IField } from '../../../core/interfaces/field.interface';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { RoleEnum } from '../../../core/enum/role.enum';
import { IAccount } from '../../../core/interfaces/account.interface';
import * as AccountActions from '../../../store/accounts/account.actions';
import { filter, pairwise, take } from 'rxjs';
import {
  selectAccountError,
  selectAccountsLoading,
} from '../../../store/accounts/account.selectors';

@Component({
  standalone: true,
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  imports: [
    CommonModule,
    DynamicFormComponent,
    PanelComponent,
    ConfirmDialogComponent,
  ],
})
export class AddAccountComponent {
  parentLabel = 'Back';
  messageError: string = '';
  showConfirm = false;
  pendingData: IAccount | null = null;
  accountField: IField<keyof IAccount>[] = [
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    {
      name: 'roleId',
      label: 'Role',
      type: 'select',
      default: RoleEnum.user,
      options: [
        { label: 'Admin', value: RoleEnum.admin },
        { label: 'User', value: RoleEnum.user },
      ],
    },
    {
      name: 'isActive',
      label: 'Account active',
      type: 'checkbox',
      default: true,
    },
  ];

  loading$;
  error$;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : 'Back';

    this.loading$ = this.store.select(selectAccountsLoading);

    this.error$ = this.store.select(selectAccountError);
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  submitUserForm(data: IAccount) {
    try {
      if (data.username.includes(' ')) {
        throw new Error('Username must not contain spaces');
      }

      if (!data.password || data.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const roleId = Number(data.roleId);
      data = { ...data, roleId };

      this.pendingData = data;
      this.showConfirm = true;
    } catch (e) {
      if (e instanceof Error) {
        this.messageError = e.message;
      } else {
        console.error('Error: ', e);
      }
    }
  }

  confirmAdd() {
    if (!this.pendingData) return;

    this.store.dispatch(
      AccountActions.addAccount({ account: this.pendingData })
    );

    // Đợi kết quả xử lý sau khi dispatch
    this.loading$
      .pipe(
        pairwise(),
        filter(([prev, curr]) => prev === true && curr === false),
        take(1)
      )
      .subscribe(() => {
        this.error$.pipe(take(1)).subscribe((error) => {
          this.showConfirm = false;

          if (!error) {
            this.pendingData = null;
            this.router.navigate(['../'], { relativeTo: this.activatedRoute });
          }
        });
      });
  }

  cancelAdd() {
    this.showConfirm = false;
    this.pendingData = null;
  }
}
