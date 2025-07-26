import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { IField } from '../../../core/interfaces/field.interface';
import { RoleEnum } from '../../../core/enum/role.enum';
import { IAccount } from '../../../core/interfaces/account.interface';

@Component({
  selector: 'app-edit-account',
  standalone: true,
  imports: [CommonModule, PanelComponent, DynamicFormComponent],
  templateUrl: './edit-account.component.html',
})
export class EditAccountComponent {
  parentLabel = 'Back';
  messageError: string = '';

  showConfirm = false;
  isLoading = false;

  accountField: IField<keyof IAccount>[] = [
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },

    {
      name: 'role',
      label: 'Role',
      type: 'select',
      default: RoleEnum.user,
      options: [
        { label: 'Admin', value: RoleEnum.admin },
        { label: 'User', value: RoleEnum.user },
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
    this.router.navigateByUrl('/module/human-resources/accounts');
  }

  // submit form
  submitUserForm(data: IAccount) {}
}
