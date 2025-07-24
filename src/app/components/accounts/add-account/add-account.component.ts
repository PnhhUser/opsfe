import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { IFormField } from '../../../core/interfaces/form-field.interface';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountModel, roleEnum } from '../models/account.model';
import { AccountService } from '../../../core/services/account.service';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';

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
  isLoading = false;
  pendingData: AccountModel | null = null;

  accountField: IFormField<keyof AccountModel>[] = [
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },

    {
      name: 'role',
      label: 'Role',
      type: 'select',
      default: roleEnum.User,
      options: [
        { label: 'Admin', value: roleEnum.Admin },
        { label: 'User', value: roleEnum.User },
      ],
    },
    {
      name: 'active',
      label: 'Account active',
      type: 'checkbox',
      default: true,
    },
  ];

  // Inject các service cần thiết
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService
  ) {
    // Lấy breadcrumb từ route cha để hiển thị label quay về
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : 'Back';
  }

  // Xử lý quay lại route cha
  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  submitUserForm(data: AccountModel) {
    this.pendingData = data;
    this.showConfirm = true;
  }

  confirmAdd() {
    if (!this.pendingData) return;
    this.isLoading = true;

    // Thêm account
    this.accountService.addAccount(this.pendingData).subscribe({
      next: () => {
        // delay 2s
        setTimeout(() => {
          this.isLoading = false;
          this.showConfirm = false;
          this.pendingData = null;
          this.router.navigate(['../'], {
            relativeTo: this.activatedRoute,
          });
        }, 2000);
      },
      error: (e) => {
        this.messageError = e.error.message;
        this.isLoading = false;
        this.showConfirm = false;
      },
    });
  }

  cancelAdd() {
    this.showConfirm = false;
    this.isLoading = false;
    this.pendingData = null;
  }
}
