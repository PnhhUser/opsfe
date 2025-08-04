import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { IField } from '../../../core/interfaces/field.interface';
import { RoleEnum } from '../../../core/enum/role.enum';
import { IUpdateAccount } from '../../../core/interfaces/account.interface';
import { Store } from '@ngrx/store';
import * as AccountActions from '../../../store/accounts/account.actions';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import {
  selectError,
  selectLoading,
} from '../../../store/accounts/account.selectors';
import { pairwise, startWith, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-edit-account',
  standalone: true,
  imports: [
    CommonModule,
    PanelComponent,
    DynamicFormComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './edit-account.component.html',
})
export class EditAccountComponent {
  parentLabel = 'Back';
  messageError: string = '';
  initialValue: Partial<IUpdateAccount> = {};

  loadingState$;
  errorState$;

  showConfirm = false;
  isLoading = false;
  pendingData: IUpdateAccount | null = null;
  hasDispatched = false;

  private subscriptions = new Subscription();

  accountField: IField<keyof IUpdateAccount>[] = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
    },
    { name: 'password', label: 'Password', type: 'password' },

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
    {
      name: 'accountId',
      label: '',
      type: 'hidden',
    },
  ];

  // Inject các service cần thiết
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private store: Store
  ) {
    // Lấy breadcrumb từ route cha để hiển thị label quay về
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : 'Back';

    this.loadingState$ = this.store
      .select(selectLoading)
      .pipe(startWith(false), pairwise());
    this.errorState$ = this.store.select(selectError);
  }

  ngOnInit() {
    const accountId = this.activatedRoute.snapshot.params?.['accountId'];

    if (!accountId) {
      this.messageError = 'Không tìm thấy ID tài khoản.';
      return;
    }

    const id = Number.parseInt(accountId);
    if (isNaN(id)) {
      this.messageError = 'ID tài khoản không hợp lệ.';
      return;
    }

    this.accountService.getAccount(Number.parseInt(accountId)).subscribe({
      next: (res) => {
        const raw = res.data;

        this.initialValue = {
          username: raw.username,
          roleId:
            raw.roleId === RoleEnum.admin ? RoleEnum.admin : RoleEnum.user,
          accountId: raw.accountId,
        };
      },
      error: (err) => {
        this.messageError = 'Không thể tải thông tin tài khoản.';
      },
    });

    const loadingSub = this.loadingState$.subscribe(([prev, curr]) => {
      if (!this.hasDispatched) return;

      if (prev === true && curr === false) {
        this.errorState$.pipe(take(1)).subscribe((error) => {
          if (error) {
            this.messageError = error.message;
            this.isLoading = false;
            this.showConfirm = false;
          } else {
            setTimeout(() => {
              this.isLoading = false;
              this.showConfirm = false;
              this.pendingData = null;
              this.router.navigateByUrl('/module/human-resources/accounts');
            }, 2000);
          }
        });
      }
    });

    this.subscriptions.add(loadingSub);
  }

  // Xử lý quay lại route cha
  goBack() {
    this.router.navigateByUrl('/module/human-resources/accounts');
  }

  // submit form
  submitUserForm(data: IUpdateAccount) {
    try {
      if (data.username.includes(' ')) {
        throw new Error('Username must not contain spaces');
      }

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

  confirmEdit() {
    if (!this.pendingData) return;
    this.hasDispatched = true;
    this.isLoading = true;

    this.store.dispatch(
      AccountActions.editAccount({ account: this.pendingData })
    );
  }

  cancelEdit() {
    this.showConfirm = false;
    this.isLoading = false;
    this.pendingData = null;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
