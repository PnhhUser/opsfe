import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { IUpdatePermission } from '../../../core/interfaces/permission.interface';
import { IField } from '../../../core/interfaces/field.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectPermission,
  selectPermissionError,
  selectPermissionLoading,
} from '../../../store/permission/permission.selector';
import { filter, map, pairwise, take } from 'rxjs';
import { ActionPermission } from '../../../store/permission/permission.actions';

@Component({
  selector: 'app-edit-permisson',
  standalone: true,
  imports: [
    CommonModule,
    PanelComponent,
    DynamicFormComponent,
    ConfirmDialogComponent,
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
        [initialValue]="initialValue"
        (formSubmit)="submitForm($event)"
        [messageError]="(error$ | async)?.message ?? messageError"
      ></app-dynamic-form>
    </app-panel>

    <app-confirm-dialog
      *ngIf="showConfirm"
      [visible]="showConfirm"
      [title]="'Xác nhận sửa quyền'"
      [message]="'Bạn có chắc muốn sửa ' + initialValue.name + ' không?'"
      [loading]="(loading$ | async) ?? false"
      [loadingText]="'Đang thêm quyền...'"
      confirmText="Đồng ý"
      cancelText="Hủy bỏ"
      (confirm)="confirm()"
      (cancel)="cancel()"
    ></app-confirm-dialog>`,
})
export class EditPermissionComponent {
  parentLabel: string = 'Back';
  showConfirm: boolean = false;
  messageError: string = '';
  pendingData: IUpdatePermission | null = null;

  initialValue: Partial<IUpdatePermission> = {};

  permissonField: IField<keyof IUpdatePermission>[] = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'key', label: 'Key', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'permissionId', label: '', type: 'hidden' },
  ];

  loading$;
  error$;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : this.parentLabel;

    this.loading$ = this.store.select(selectPermissionLoading);
    this.error$ = this.store.select(selectPermissionError);
  }

  ngOnInit() {
    const permissonId = this.activatedRoute.snapshot.params?.['permissonId'];

    if (!permissonId) {
      this.messageError = 'Không tìm thấy ID phòng ban.';
      return;
    }

    const id = Number.parseInt(permissonId);
    if (isNaN(id)) {
      this.messageError = 'ID phòng ban không hợp lệ.';
      return;
    }

    this.store
      .select(selectPermission)
      .pipe(
        map((data) => {
          return data.filter((v) => v.id === id).find((v) => v);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.initialValue = {
            name: data.name,
            key: data.key,
            description: data.description,
            permissionId: data.id,
          };
        }
      });
  }

  goBack() {
    this.router.navigateByUrl('/module/access-control/permissions');
  }

  submitForm(data: IUpdatePermission) {
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
      ActionPermission.editPermission({ permission: this.pendingData })
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
            this.router.navigateByUrl('/module/access-control/permissions');
          }
        });
      });
  }

  cancel() {
    this.showConfirm = false;
    this.pendingData = null;
  }
}
