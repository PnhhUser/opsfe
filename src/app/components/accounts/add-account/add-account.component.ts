import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { IField } from '../../../core/interfaces/field.interface';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { RoleEnum } from '../../../core/enum/role.enum';
import { IAccount } from '../../../core/interfaces/account.interface';
import * as AccountActions from '../../../store/accounts/account.actions';
import * as AccountSelectors from '../../../store/accounts/account.selectors';
import { pairwise, startWith, Subscription, take } from 'rxjs';

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
export class AddAccountComponent implements OnInit, OnDestroy {
  parentLabel = 'Back';
  messageError: string = '';
  showConfirm = false;
  isLoading = false;
  pendingData: IAccount | null = null;
  hasDispatched = false;

  private subscriptions = new Subscription();

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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private store: Store
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : 'Back';
  }

  ngOnInit() {
    const loadingSub = this.store
      .select(AccountSelectors.selectLoading)
      .pipe(startWith(false), pairwise())
      .subscribe(([prev, curr]) => {
        if (!this.hasDispatched) return;

        if (prev === true && curr === false) {
          // Khi xử lý xong, kiểm tra error sau
          this.store
            .select(AccountSelectors.selectError)
            .pipe(take(1))
            .subscribe((error) => {
              if (error) {
                this.messageError = error.message;
                this.isLoading = false;
                this.showConfirm = false;
              } else {
                setTimeout(() => {
                  this.isLoading = false;
                  this.showConfirm = false;
                  this.pendingData = null;
                  this.router.navigate(['../'], {
                    relativeTo: this.activatedRoute,
                  });
                }, 2000);
              }
            });
        }
      });

    this.subscriptions.add(loadingSub);
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
    this.hasDispatched = true;
    this.isLoading = true;
    this.store.dispatch(
      AccountActions.addAccount({ account: this.pendingData })
    );
  }

  cancelAdd() {
    this.showConfirm = false;
    this.isLoading = false;
    this.pendingData = null;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
