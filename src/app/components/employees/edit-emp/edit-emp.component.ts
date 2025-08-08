import { EmployeeService } from './../../../core/services/employee.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog.component';
import { IUpdateEmployee } from '../../../core/interfaces/employee.interface';
import { IField } from '../../../core/interfaces/field.interface';
import { Gender } from '../../../core/enum/gender.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectEmpError,
  selectEmpLoading,
  selectEmps,
} from '../../../store/employees/employee.selectors';
import { combineLatest, filter, map, pairwise, take } from 'rxjs';
import { ActionEmployee } from '../../../store/employees/employee.actions';
import { ActionPosition } from '../../../store/positions/position.actions';
import { selectPositions } from '../../../store/positions/position.selector';
import { selectAccounts } from '../../../store/accounts/account.selectors';
import { loadAccount } from '../../../store/accounts/account.actions';

@Component({
  selector: 'app-edit-emp',
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
        [messageError]="(error$ | async)?.message ?? messageError"
      ></app-dynamic-form>
    </app-panel>

    <app-confirm-dialog
      *ngIf="showConfirm"
      [message]="'Bạn có chắc muốn thêm ' + pendingData?.fullName + ' Không ?'"
      [loading]="(loading$ | async) ?? false"
      (confirm)="confirmAdd()"
      (cancel)="cancelAdd()"
    ></app-confirm-dialog> `,
})
export class EditEmpComponent {
  parentLabel: string = 'Back';
  showConfirm: boolean = false;
  messageError: string = '';
  pendingData: IUpdateEmployee | null = null;

  initialValue: Partial<IUpdateEmployee> = {};

  accountField: IField<keyof IUpdateEmployee>[] = [
    { name: 'fullName', label: 'Full name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phoneNumber', label: 'Phone number', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      default: Gender.OTHER,
      options: [
        { label: 'Male', value: Gender.MALE },
        { label: 'Female', value: Gender.FEMALE },
        { label: 'Other', value: Gender.OTHER },
      ],
    },
    { name: 'dateOfBirth', label: 'Data of birth', type: 'date' },
    { name: 'startDate', label: 'Start date', type: 'date' },
    {
      name: 'accountId',
      label: 'Account',
      type: 'select',
      default: null,
      options: [
        {
          label: 'No assigned',
          value: null,
        },
      ],
    },
    {
      name: 'positionId',
      label: 'Position',
      type: 'select',
      default: null,
      options: [{ label: 'No assigned', value: null }],
    },
    { name: 'isActive', label: 'Active', type: 'checkbox', default: true },
    { name: 'employeeId', label: '', type: 'hidden' },
  ];

  loading$;
  error$;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private employeeService: EmployeeService
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : this.parentLabel;

    this.loading$ = this.store.select(selectEmpLoading);
    this.error$ = this.store.select(selectEmpError);
  }

  ngOnInit() {
    const employeeId = this.activatedRoute.snapshot.params?.['employeeId'];

    if (!employeeId) {
      this.messageError = 'Không tìm thấy ID nhân viên.';
      return;
    }

    const id = Number.parseInt(employeeId);
    if (isNaN(id)) {
      this.messageError = 'ID nhân viên không hợp lệ.';
      return;
    }

    this.store.dispatch(ActionPosition.loadPositions());
    this.store.dispatch(loadAccount());

    // Load positions
    this.store
      .select(selectPositions)
      .pipe(
        filter((positions) => positions.length > 0),
        take(1)
      )
      .subscribe((positions) => {
        const options = [
          { label: 'No assigned', value: null },
          ...positions.map((pos) => ({
            label: pos.key,
            value: pos.positionId,
          })),
        ];

        // Cập nhật field positionId
        const field = this.accountField.find((f) => f.name === 'positionId');
        if (field) field.options = options;
      });

    // load available accounts
    this.employeeService.availableAccountsById(id).subscribe((res) => {
      let accounts = res.data;

      const options = [
        { label: 'No assigned', value: null },
        ...accounts.map((a) => ({
          label: a.name,
          value: a.id,
        })),
      ];

      const field = this.accountField.find((f) => f.name === 'accountId');
      if (field) field.options = options;
    });

    // load data
    combineLatest([
      this.store.select(selectEmps).pipe(
        filter((e) => e.length > 0),
        take(1)
      ),
      this.store.select(selectPositions).pipe(
        filter((p) => p.length > 0),
        take(1)
      ),
      this.store.select(selectAccounts).pipe(
        filter((a) => a.length > 0),
        take(1)
      ),
    ])
      .pipe(
        map(([employees, positions, accounts]) => {
          const emp = employees.find((v) => v.employeeId === id);
          const position = positions.find((p) => p.name === emp?.positionName);

          const account = accounts.find((v) => v.username === emp?.accountName);

          if (emp) {
            return {
              ...emp,
              positionId: position?.positionId ?? null,
              accountId: account?.accountId ?? null,
            };
          }
          return null;
        }),
        filter((val) => !!val),
        take(1)
      )
      .subscribe((data) => {
        this.initialValue = data;
      });
  }

  goBack() {
    this.router.navigateByUrl('/module/human-resources/employees');
  }

  submitForm(data: IUpdateEmployee) {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (data.email && !emailRegex.test(data.email)) {
        throw new Error('Invalid email');
      }

      this.messageError = '';

      data = {
        ...data,
        positionId: data.positionId === null ? null : Number(data.positionId),
        // Chỉ cập nhật accountId nếu khác giá trị ban đầu
        accountId:
          data.accountId !== this.initialValue.accountId
            ? data.accountId === null
              ? null
              : Number(data.accountId)
            : this.initialValue.accountId,
      };

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
      ActionEmployee.editEmployee({ employee: this.pendingData })
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
            this.router.navigateByUrl('/module/human-resources/employees');
          }
        });
      });
  }

  cancelAdd() {
    this.showConfirm = false;
    this.pendingData = null;
  }
}
