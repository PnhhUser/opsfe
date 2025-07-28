import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { CRUDComponent } from '../../shared/components/crud/crud.component';
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowClickedEvent,
} from 'ag-grid-community';

interface IDepartmentTable {
  departmentId: number;
  name: string;
  description: string;
  createDate: Date;
  updateDate: Date;
}

@Component({
  selector: 'app-account',
  standalone: true,
  templateUrl: './department.component.html',
  imports: [CommonModule, AgGridModule, RouterOutlet, CRUDComponent],
})
export class DepartmentComponent {
  parentLabel = 'Back';
  selectDepartmentId: { id: number } | null = null;
  gridApi!: GridApi;
  prefixRouter: string;

  rowData: IDepartmentTable[] = [];

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

  columnDefs: ColDef<IDepartmentTable>[] = [
    { field: 'name', sortable: true, filter: true, minWidth: 140 },
    { field: 'description', sortable: true, minWidth: 140 },
    { field: 'createDate', sortable: true, minWidth: 150 },
    { field: 'updateDate', sortable: true, minWidth: 150 },
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
    this.selectDepartmentId = { id: accountId };
  }

  exportCSV() {}
}
