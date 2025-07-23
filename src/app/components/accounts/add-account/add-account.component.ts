import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { IFormField } from '../../../core/interfaces/form-field.interface';
import { IAccountTable } from '../interfaces/account-table.interface';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AddAccountModel, roleEnum } from '../models/add-account.model';
import { AccountService } from '../../../core/services/account.service';

@Component({
  standalone: true,
  selector: 'app-account-add',
  templateUrl: './add-account.component.html',
  imports: [CommonModule, DynamicFormComponent, PanelComponent],
})
export class AddAccountComponent {
  parentLabel = 'Back';
  messageError: string = '';

  accountField: IFormField<keyof AddAccountModel>[] = [
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

  submitUserForm(data: AddAccountModel) {
    console.log(data);

    this.accountService.addAccount(data).subscribe({
      next: () => {
        console.log('ok');
      },
      error: (e) => {
        this.messageError = e.error.message;
      },
    });
  }
}
