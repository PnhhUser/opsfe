import {
  selecDepartmentError,
  selectDepartmentLoading,
  selectDepartments,
} from './../../../store/departments/department.selectors';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { IUpdateDepertment } from '../../../core/interfaces/department.interface';
import { IField } from '../../../core/interfaces/field.interface';
import { filter, map, pairwise, take } from 'rxjs';
import { ActionDepartment } from '../../../store/departments/department.actions';
import {
  selectPositionError,
  selectPositionLoading,
  selectPositions,
} from '../../../store/positions/position.selector';
import {
  ILoadPosition,
  IUpdatePosition,
} from '../../../core/interfaces/position.interface';
import { ActionPosition } from '../../../store/positions/position.actions';

@Component({
  selector: 'app-edit-position',
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
        [initialValue]="initialValue"
        (formSubmit)="submitForm($event)"
        [messageError]="messageError"
      ></app-dynamic-form>
    </app-panel>

    <app-confirm-dialog
      *ngIf="showConfirm"
      [message]="'Bạn có chắc muốn thêm ' + pendingData?.name + ' không?'"
      [loading]="(loading$ | async) ?? false"
      (confirm)="confirmAdd()"
      (cancel)="cancelAdd()"
    ></app-confirm-dialog> `,
})
export class EditPositionComponent {
  parentLabel: string = 'Back';
  showConfirm: boolean = false;
  messageError: string = '';
  pendingData: IUpdatePosition | null = null;

  initialValue: Partial<IUpdatePosition> = {};

  accountField: IField<keyof IUpdatePosition>[] = [];

  loading$;
  error$;
  departments$;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : this.parentLabel;

    this.loading$ = this.store.select(selectPositionLoading);
    this.error$ = this.store.select(selectPositionError);

    this.departments$ = this.store.select(selectDepartments);
  }

  ngOnInit() {
    this.store.dispatch(ActionDepartment.loadDepartments());

    const positionId = this.activatedRoute.snapshot.params?.['positionId'];

    if (!positionId) {
      this.messageError = 'Không tìm thấy ID phòng ban.';
      return;
    }

    const id = Number.parseInt(positionId);
    if (isNaN(id)) {
      this.messageError = 'ID phòng ban không hợp lệ.';
      return;
    }

    this.store
      .select(selectPositions)
      .pipe(
        map((d) => d.find((v) => v.positionId === id)),
        take(1) // ✅ Chỉ lấy 1 lần
      )
      .subscribe((p) => {
        if (!p) return;

        this.departments$
          .pipe(take(1)) // ✅ Tránh nested subscribe lâu dài
          .subscribe((departments) => {
            const departmentOptions = [
              { label: 'Chưa xác định', value: null },
              ...departments.map((d) => ({
                label: d.name,
                value: d.departmentId,
              })),
            ];

            const optionDefault = departments
              .filter((v) => v.name === p.departmentName)
              .map((d) => ({
                label: d.name,
                value: d.departmentId,
              }))
              .find((r) => r);

            // ✅ Gán giá trị ban đầu
            this.initialValue = {
              name: p.name,
              key: p.key,
              positionId: p.positionId,
              departmentId: optionDefault?.value ?? null,
              description: p.description,
              baseSalary: p.baseSalary,
            };

            this.accountField = [
              { name: 'name', label: 'Name', type: 'text', required: true },
              { name: 'key', label: 'Key', type: 'text', required: true },
              {
                name: 'departmentId',
                label: 'Department',
                type: 'select',
                default: optionDefault?.value ?? null,
                options: departmentOptions,
              },
              {
                name: 'baseSalary',
                label: 'Base salary',
                type: 'number',
              },
              { name: 'description', label: 'Description', type: 'textarea' },
              { name: 'positionId', label: '', type: 'hidden' },
            ];
          });
      });
  }

  goBack() {
    this.router.navigateByUrl('/module/human-resources/positions');
  }

  submitForm(data: IUpdatePosition) {
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

  confirmAdd() {
    if (!this.pendingData) return;

    this.store.dispatch(
      ActionPosition.editPosition({ position: this.pendingData })
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

          if (error) {
            this.messageError = error.message;
          } else {
            this.pendingData = null;
            this.router.navigateByUrl('/module/human-resources/positions');
          }
        });
      });
  }

  cancelAdd() {
    this.showConfirm = false;
    this.pendingData = null;
  }
}
