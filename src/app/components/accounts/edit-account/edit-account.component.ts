import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { IFormField } from '../../../core/interfaces/form-field.interface';
import { AccountModel, roleEnum } from '../models/account.model';

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
    this.router.navigateByUrl('/module/human-resources/accounts');
  }

  // submit form
  submitUserForm(data: AccountModel) {}
}
