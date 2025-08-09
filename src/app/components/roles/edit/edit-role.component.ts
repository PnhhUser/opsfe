import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { IUpdateRole } from '../../../core/interfaces/role.interface';
import { IField } from '../../../core/interfaces/field.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectRoles,
  selectRolesError,
  selectRolesLoading,
} from '../../../store/role/role.selector';
import { filter, map, pairwise, take } from 'rxjs';
import { ActionRole } from '../../../store/role/role.actions';

@Component({
  selector: 'app-edit-role',
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
        [fields]="field"
        [initialValue]="initialValue"
        (formSubmit)="submitForm($event)"
        [messageError]="(error$ | async)?.message ?? messageError"
      ></app-dynamic-form>
    </app-panel>

    <app-confirm-dialog
      *ngIf="showConfirm"
      [message]="'Bạn có chắc muốn sửa không?'"
      [loading]="(loading$ | async) ?? false"
      (confirm)="confirmAdd()"
      (cancel)="cancelAdd()"
    ></app-confirm-dialog> `,
})
export class EditRoleComponent {
  parentLabel: string = 'Back';
  showConfirm: boolean = false;
  messageError: string = '';
  pendingData: IUpdateRole | null = null;

  initialValue: Partial<IUpdateRole> = {};

  field: IField<keyof IUpdateRole>[] = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'key', label: 'Key', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'roleId', label: '', type: 'hidden' },
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

    this.loading$ = this.store.select(selectRolesLoading);
    this.error$ = this.store.select(selectRolesError);
  }

  ngOnInit() {
    const roleId = this.activatedRoute.snapshot.params?.['roleId'];

    if (!roleId) {
      this.messageError = 'Không tìm thấy ID phòng ban.';
      return;
    }

    const id = Number.parseInt(roleId);
    if (isNaN(id)) {
      this.messageError = 'ID phòng ban không hợp lệ.';
      return;
    }

    this.store
      .select(selectRoles)
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
            roleId: data.id,
          };
        }
      });
  }

  goBack() {
    this.router.navigateByUrl('/module/access-control/roles');
  }

  submitForm(data: IUpdateRole) {
    try {
      if (data.key.includes(' ')) {
        throw new Error('Key must not contain spaces');
      }

      this.pendingData = data;
      this.showConfirm = true;

      console.log(data);
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

    this.store.dispatch(ActionRole.editRole({ role: this.pendingData }));

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
            this.router.navigateByUrl('/module/access-control/roles');
          }
        });
      });
  }

  cancelAdd() {
    this.showConfirm = false;
    this.pendingData = null;
  }
}
