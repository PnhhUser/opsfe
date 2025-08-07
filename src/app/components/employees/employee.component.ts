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
import { filter, take } from 'rxjs';

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
  columnDefs: ColDef<ILoadEmployee>[] = [
    {
      field: 'fullName',
      headerName: 'full name',
      sortable: true,
      filter: true,
      minWidth: 280,
    },
    { field: 'email', sortable: true, filter: true, minWidth: 280 },
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
      minWidth: 100,
    },
    {
      field: 'positionName',
      headerName: 'Position',
      cellRenderer: (params: ICellRendererParams) => {
        const value = params.value;

        if (!value) {
          return `
      <span class="inline-flex justify-center rounded-md px-2 py-1 text-xs font-medium ring-1 bg-red-50 text-red-700 ring-red-700/10 ring-inset min-w-[90px]">
        Not Assigned
      </span>
    `;
        }

        return value;
      },
      sortable: true,
      filter: true,
      minWidth: 230,
    },
    {
      field: 'departmentName',
      headerName: 'Department',
      cellRenderer: (params: ICellRendererParams) => {
        const value = params.value;

        if (!value) {
          return `
      <span class="inline-flex justify-center rounded-md px-2 py-1 text-xs font-medium ring-1 bg-red-50 text-red-700 ring-red-700/10 ring-inset min-w-[90px]">
        Not Assigned
      </span>
    `;
        }

        return value;
      },
      sortable: true,
      filter: true,
      minWidth: 230,
    },
    {
      field: 'accountName',
      headerName: 'Account',
      cellRenderer: (params: ICellRendererParams) => {
        const value = params.value;

        if (!value) {
          return `
      <span class="inline-flex justify-center rounded-md px-2 py-1 text-xs font-medium ring-1 bg-red-50 text-red-700 ring-red-700/10 ring-inset min-w-[90px]">
        Not Assigned
      </span>
    `;
        }

        return value;
      },
      sortable: true,
      filter: true,
      minWidth: 230,
    },
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : this.parentLabel;

    this.prefixRouter = this.router.url;

    this.loading$ = this.store.select(selectEmpLoading);
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

  exportCSV() {}
}
