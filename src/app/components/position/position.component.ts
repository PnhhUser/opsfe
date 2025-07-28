import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CRUDComponent } from '../../shared/components/crud/crud.component';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowClickedEvent,
} from 'ag-grid-community';

interface IPositionTable {
  name: string;
  description: string;
  baseSalary: string;
  createAt: Date;
  updateAt: Date;
}

@Component({
  selector: 'app-account',
  standalone: true,
  templateUrl: './position.component.html',
  imports: [CommonModule, AgGridModule, RouterOutlet, CRUDComponent],
})
export class PositionComponent {
  parentLabel = 'Back';
  selectPositionId: { id: number } | null = null;
  gridApi!: GridApi;
  prefixRouter: string;

  rowData: IPositionTable[] = [];

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

  columnDefs: ColDef<IPositionTable>[] = [
    {
      field: 'name',
      sortable: true,
      filter: true,
      minWidth: 140,
    },
    {
      field: 'description',
      sortable: true,
      filter: true,
      minWidth: 140,
    },
    {
      field: 'baseSalary',
      headerName: 'base salary',
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
    this.selectPositionId = { id: accountId };
  }

  exportCSV() {}
}
