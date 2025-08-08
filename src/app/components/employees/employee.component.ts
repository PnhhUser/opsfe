import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  RowClickedEvent,
} from 'ag-grid-community';
import { CRUDComponent } from '../../shared/components/crud/crud.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ILoadEmployee } from '../../core/interfaces/employee.interface';
import { Store } from '@ngrx/store';
import {
  selectEmpLoading,
  selectEmps,
} from '../../store/employees/employee.selectors';
import { ActionEmployee } from '../../store/employees/employee.actions';
import { Utils } from '../../core/utils/index.utils';
import { map } from 'rxjs';
import { PanelComponent } from '../../shared/components/panel/panel.component';
import { Gender } from '../../core/enum/gender.enum';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CRUDComponent,
    TableComponent,
    LoadingComponent,
  ],
  templateUrl: './employee.component.html',
})
export class EmployeeComponent {
  parentLabel = 'Back';
  selectEmpItem: { id: number } | null = null;
  gridApi!: GridApi;
  prefixRouter: string;
  loading$;
  emps$;
  employees: ILoadEmployee[] = [];
  showView: boolean = false;
  columnDefs: ColDef<ILoadEmployee>[] = [
    {
      field: 'fullName',
      headerName: 'full name',
      sortable: true,
      filter: true,
    },
    { field: 'email', sortable: true, filter: true },
    {
      field: 'isActive',
      headerName: 'active',
      cellRenderer: (params: ICellRendererParams) => {
        const isActive = params.value;
        const label = isActive ? 'Active' : 'Inactive';
        const badgeClass = isActive
          ? 'bg-green-50 text-green-700 ring-green-700/10'
          : 'bg-red-50 text-red-700 ring-red-700/10';

        return `
      <span class="inline-flex justify-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ${badgeClass} ring-inset min-w-[70px]">
        ${label}
      </span>
    `;
      },
      sortable: true,
    },
    {
      field: 'positionName',
      headerName: 'Position',
      cellRenderer: (params: ICellRendererParams) => {
        const value = params.value;

        if (!value) {
          return `
      <span class="inline-flex justify-center rounded-md px-2 py-1 text-xs font-medium ring-1 bg-red-50 text-red-700 ring-red-700/10 ring-inset min-w-[90px]">
        No assigned
      </span>
    `;
        }

        return value;
      },
      sortable: true,
      filter: true,
    },
    {
      field: 'departmentName',
      headerName: 'Department',
      cellRenderer: (params: ICellRendererParams) => {
        const value = params.value;

        if (!value) {
          return `
      <span class="inline-flex justify-center rounded-md px-2 py-1 text-xs font-medium ring-1 bg-red-50 text-red-700 ring-red-700/10 ring-inset min-w-[90px]">
        No assigned
      </span>
    `;
        }

        return value;
      },
      sortable: true,
      filter: true,
    },
    {
      field: 'accountName',
      headerName: 'Account',
      cellRenderer: (params: ICellRendererParams) => {
        const value = params.value;

        if (!value) {
          return `
      <span class="inline-flex justify-center rounded-md px-2 py-1 text-xs font-medium ring-1 bg-red-50 text-red-700 ring-red-700/10 ring-inset min-w-[90px]">
        No assigned
      </span>
    `;
        }

        return value;
      },
      sortable: true,
      filter: true,
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      cellRenderer: (params: ICellRendererParams) => {
        const value = params.value;

        if (!value) {
          return `
      <span class="inline-flex justify-center rounded-md px-2 py-1 text-xs font-medium ring-1 bg-red-50 text-red-700 ring-red-700/10 ring-inset min-w-[90px]">
        No phone
      </span>
    `;
        }

        return value;
      },
      sortable: true,
    },
    {
      field: 'address',
      headerName: 'Address',
      cellRenderer: (params: ICellRendererParams) => {
        const value = params.value;

        if (!value) {
          return `
      <span class="inline-flex justify-center rounded-md px-2 py-1 text-xs font-medium ring-1 bg-red-50 text-red-700 ring-red-700/10 ring-inset min-w-[90px]">
        No address
      </span>
    `;
        }

        return value;
      },
      sortable: true,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      sortable: true,
      minWidth: 80,
      maxWidth: 120,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      sortable: true,
      cellRenderer: ({ value }: ICellRendererParams) => {
        console.log(value);

        if (!value) {
          return `
      <span class="inline-flex justify-center rounded-md px-2 py-1 text-xs font-medium ring-1 bg-red-50 text-red-700 ring-red-700/10 ring-inset min-w-[90px]">
        No assigned
      </span>
    `;
        }

        return Utils.toLocaleDateString(value);
      },
    },
    {
      field: 'dateOfBirth',
      headerName: 'Date of Birth',
      sortable: true,
      cellRenderer: ({ value }: ICellRendererParams) => {
        console.log(value);

        if (!value) {
          return `
      <span class="inline-flex justify-center rounded-md px-2 py-1 text-xs font-medium ring-1 bg-red-50 text-red-700 ring-red-700/10 ring-inset min-w-[90px]">
        No assigned
      </span>
    `;
        }

        return Utils.toLocaleDateString(value);
      },
    },
    {
      field: 'createAt',
      headerName: 'Create date',
      sortable: true,
      cellRenderer: ({ value }: ICellRendererParams) =>
        Utils.toLocaleDatetimeString(value),
    },
    {
      field: 'updateAt',
      headerName: 'Update date',
      sortable: true,
      cellRenderer: ({ value }: ICellRendererParams) =>
        Utils.toLocaleDatetimeString(value),
    },
  ];

  employeeView: ILoadEmployee[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : this.parentLabel;

    this.prefixRouter = Utils.getFullRoutePath(this.activatedRoute.snapshot);

    this.loading$ = Utils.withMinDelay(this.store.select(selectEmpLoading));
    this.emps$ = this.store.select(selectEmps);
  }

  ngOnInit() {
    this.store.dispatch(ActionEmployee.loadEmployees());

    this.emps$.subscribe((res: ILoadEmployee[]) => {
      this.employees = res.map((emp) => ({
        employeeId: emp.employeeId,
        fullName: emp.fullName,
        email: emp.email,
        address: emp.address,
        phoneNumber: emp.phoneNumber,
        createAt: emp.createAt,
        updateAt: emp.updateAt,
        dateOfBirth: emp.dateOfBirth,
        startDate: emp.startDate,
        accountName: emp.accountName,
        positionName: emp.positionName,
        isActive: emp.isActive,
        gender: emp.gender,
        departmentName: emp.departmentName,
      }));
    });
  }

  isParentRoute(): boolean {
    const currentRoute = this.activatedRoute;
    return !currentRoute.firstChild;
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  onRowClicked(event: RowClickedEvent) {
    const accountId = event.data.accountId;
    this.selectEmpItem = { id: accountId };
  }

  onRowSelect(event: { id: number } | null) {
    this.selectEmpItem = event === null ? null : { id: event.id };
  }

  onGirdEvent(gird: { event: GridReadyEvent }) {
    this.gridApi = gird.event.api;
  }

  exportCSV() {
    if (!this.gridApi) return;
    this.gridApi.exportDataAsCsv({
      fileName: 'DanhSachNhanvien.csv',
    });
  }

  onViewSelectItem(selectItem: { id: number } | null) {
    this.showView = true;
    this.emps$
      .pipe(
        map((emps) => emps.filter((emp) => emp.employeeId === selectItem?.id))
      )
      .subscribe((data: ILoadEmployee[]) => {
        this.employeeView = data;
      });
  }

  closeDialogView() {
    this.showView = false;
  }
}
