import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IPosition } from '../../../core/interfaces/position.interface';
import { IField } from '../../../core/interfaces/field.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectPositionError,
  selectPositionLoading,
} from '../../../store/positions/position.selector';
import { ActionPosition } from '../../../store/positions/position.actions';
import { filter, pairwise, take } from 'rxjs';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { selectDepartments } from '../../../store/departments/department.selectors';
import { ActionDepartment } from '../../../store/departments/department.actions';

@Component({
  selector: 'app-add-position',
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
        [fields]="accountField"
        (formSubmit)="submitUserForm($event)"
        [messageError]="(error$ | async)?.message ?? messageError"
      ></app-dynamic-form>
    </app-panel>

    <app-confirm-dialog
      *ngIf="showConfirm"
      [visible]="showConfirm"
      [title]="'Xác nhận thêm vị trí'"
      [message]="'Bạn có chắc muốn thêm ' + pendingData?.name + ' không?'"
      [loading]="(loading$ | async) ?? false"
      [loadingText]="'Đang thêm vị trí...'"
      confirmText="Đồng ý"
      cancelText="Hủy bỏ"
      (confirm)="confirm()"
      (cancel)="cancel()"
    ></app-confirm-dialog> `,
})
export class AddPositionComponent {
  parentLabel = 'Back';
  messageError: string = '';
  showConfirm = false;
  pendingData: IPosition | null = null;

  loading$;
  error$;
  departments$;

  accountField: IField<keyof IPosition>[] = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'key', label: 'Key', type: 'text', required: true },
    {
      name: 'departmentId',
      label: 'Department',
      type: 'select',
      default: null,
      options: [{ label: 'No Assigned', value: null }],
    },
    {
      name: 'baseSalary',
      label: 'Base salary',
      type: 'text',
      money: true,
    },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : 'Back';

    this.loading$ = this.store.select(selectPositionLoading);
    this.error$ = this.store.select(selectPositionError);
    this.departments$ = this.store.select(selectDepartments);
  }

  ngOnInit() {
    this.store.dispatch(ActionDepartment.loadDepartments());

    this.departments$
      .pipe(
        filter((data) => data.length > 0),
        take(1)
      )
      .subscribe((data) => {
        const departmentOptions = [
          { label: 'No Assigned', value: null },
          ...data.map((d) => ({
            label: d.key,
            value: d.departmentId,
          })),
        ];

        const field = this.accountField.find((f) => f.name === 'departmentId');
        if (field) {
          field.options = departmentOptions;
        }
      });
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  submitUserForm(data: IPosition) {
    try {
      if (data.key.includes(' ')) {
        throw new Error('Key must not contain spaces');
      }

      const departmentId =
        data.departmentId !== null ? Number(data.departmentId) : null;

      const baseSalary =
        data.baseSalary !== null ? Number(data.baseSalary) : null;

      data = { ...data, departmentId, baseSalary };

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
      ActionPosition.addPosition({ position: this.pendingData })
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
