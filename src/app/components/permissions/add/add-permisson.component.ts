import { selectPermissionError } from './../../../store/permission/permission.selector';
import { DynamicFormComponent } from './../../../shared/components/dynamic-form/dynamic-form.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IPermission } from '../../../core/interfaces/permission.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { selectPermissionLoading } from '../../../store/permission/permission.selector';
import { ActionPermission } from '../../../store/permission/permission.actions';
import { filter, pairwise, take } from 'rxjs';
import { IField } from '../../../core/interfaces/field.interface';

@Component({
  selector: 'app-add-permission',
  standalone: true,
  imports: [
    CommonModule,
    PanelComponent,
    ConfirmDialogComponent,
    DynamicFormComponent,
  ],
  template: `<button
      (click)="goBack()"
      class="flex items-center text-sm text-blue-600 hover:underline mb-4"
    >
      ← {{ parentLabel }}
    </button>

    <app-panel [column]="1">
      <app-dynamic-form
        [fields]="permissonField"
        (formSubmit)="submitUserForm($event)"
        [messageError]="(error$ | async)?.message ?? messageError"
      ></app-dynamic-form>
    </app-panel>

    <app-confirm-dialog
      *ngIf="showConfirm"
      [visible]="showConfirm"
      [title]="'Xác nhận thêm quyền'"
      [message]="'Bạn có chắc muốn thêm ' + pendingData?.name + ' không?'"
      [loading]="(loading$ | async) ?? false"
      [loadingText]="'Đang thêm quyền...'"
      confirmText="Đồng ý"
      cancelText="Hủy bỏ"
      (confirm)="confirm()"
      (cancel)="cancel()"
    ></app-confirm-dialog> `,
})
export class AddPermissionComponent {
  parentLabel = 'Back';
  messageError: string = '';
  showConfirm = false;
  pendingData: IPermission | null = null;

  loading$;
  error$;

  permissonField: IField<keyof IPermission>[] = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'key', label: 'Key', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : 'Back';

    this.loading$ = this.store.select(selectPermissionLoading);
    this.error$ = this.store.select(selectPermissionError);
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  submitUserForm(data: IPermission) {
    try {
      if (data.key.includes(' ')) {
        throw new Error('Key must not contain spaces');
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

  confirm() {
    if (!this.pendingData) return;

    this.store.dispatch(
      ActionPermission.addPermission({ permission: this.pendingData })
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

  cancel() {
    this.showConfirm = false;
    this.pendingData = null;
  }
}
