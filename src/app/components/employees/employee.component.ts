import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowClickedEvent,
} from 'ag-grid-community';
import { CRUDComponent } from '../../shared/components/crud/crud.component';
import { AgGridModule } from 'ag-grid-angular';

interface IEmployeeTable {
  employeeId: number;
  fullname: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: string;
  dateOfBirth: Date;
  startDate: Date;
  position: string;
  department: string;
  isActive: boolean;
  createAt: Date;
  updateAt: Date;
}

@Component({
  selector: 'app-employee',
  standalone: true,
  templateUrl: './employee.component.html',
  imports: [CommonModule, AgGridModule, RouterOutlet, CRUDComponent],
})
export class EmployeeComponent {
  parentLabel = 'Back';
  selectEmpId: { id: number } | null = null;
  gridApi!: GridApi;
  prefixRouter: string;

  rowData: IEmployeeTable[] = [];

  // Cấu hình chung của AG Grid
  gridOptions: GridOptions = {
    rowSelection: 'single',
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [5, 10, 20, 50, 100],
    rowHeight: 50,
    headerHeight: 46,
    domLayout: 'autoHeight',
  };

  columnDefs: ColDef<IEmployeeTable>[] = [
    {
      field: 'fullname',
      headerName: 'full name',
      sortable: true,
      filter: true,
      minWidth: 140,
    },
    { field: 'email', sortable: true, filter: true, minWidth: 140 },
    {
      field: 'phoneNumber',
      headerName: 'phone number',
      sortable: true,
      filter: true,
      minWidth: 140,
    },
    { field: 'address', sortable: true, filter: true, minWidth: 140 },
    {
      field: 'dateOfBirth',
      headerName: 'date of birth',
      sortable: true,
      filter: true,
      minWidth: 140,
    },
    {
      field: 'startDate',
      headerName: 'start date',
      sortable: true,
      filter: true,
      minWidth: 140,
    },
    { field: 'position', sortable: true, filter: true, minWidth: 140 },
    { field: 'department', sortable: true, filter: true, minWidth: 140 },
    {
      field: 'isActive',
      headerName: 'active',
      sortable: true,
      filter: true,
      minWidth: 140,
    },
    {
      field: 'createAt',
      headerName: 'create date',
      sortable: true,
      filter: true,
      minWidth: 140,
    },
    {
      field: 'updateAt',
      headerName: 'update date',
      sortable: true,
      filter: true,
      minWidth: 140,
    },
  ];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : 'Back';

    this.prefixRouter = this.router.url;
  }

  isParentRoute(): boolean {
    const currentRoute = this.activatedRoute;
    return !currentRoute.firstChild;
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  onGridReady(event: GridReadyEvent) {
    this.gridApi = event.api;
    event.api.sizeColumnsToFit();
  }

  onRowClicked(event: RowClickedEvent) {
    const accountId = event.data.accountId;
    this.selectEmpId = { id: accountId };
  }

  exportCSV() {}
}
