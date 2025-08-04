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
import { Store } from '@ngrx/store';
import { selectDepartments } from '../../store/departments/department.selectors';
import { Observable } from 'rxjs';
import { IloadDepartment } from '../../core/interfaces/department.interface';
import { ActionDepartment } from '../../store/departments/department.actions';
import { DatetimeUtils } from '../../core/utils/datetime.utils';

interface IDepartmentTable {
  departmentId: number;
  name: string;
  key: string;
  description: string;
  createDate: string;
  updateDate: string;
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

  departments$: Observable<IloadDepartment[]>;

  // Cấu hình chung của AG Grid
  gridOptions: GridOptions = {
    rowSelection: 'single',
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [5, 10, 20, 50, 100],
    domLayout: 'autoHeight',
  };

  columnDefs: ColDef<IDepartmentTable>[] = [
    { field: 'name', sortable: true, filter: true, minWidth: 140 },
    { field: 'key', sortable: true, filter: true, minWidth: 140 },
    { field: 'description', sortable: true, minWidth: 140 },
    {
      field: 'createDate',
      headerName: 'Date Added',
      sortable: true,
      minWidth: 150,
    },
    {
      field: 'updateDate',
      headerName: 'Date Edited',
      sortable: true,
      minWidth: 150,
    },
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : 'Back';

    this.prefixRouter = this.router.url;

    this.departments$ = this.store.select(selectDepartments);
  }

  ngOnInit() {
    this.loadData();
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
    const departmentId = event.data.departmentId;
    this.selectDepartmentId = { id: departmentId };
  }

  loadData() {
    this.store.dispatch(ActionDepartment.loadDepartments());

    this.departments$.subscribe((departments: IloadDepartment[]) => {
      this.rowData = departments.map((department) => {
        return {
          departmentId: department.departmentId,
          name: department.name,
          key: department.key,
          description: department.description,
          updateDate: DatetimeUtils.toLocaleDateString(department.updateAt),
          createDate: DatetimeUtils.toLocaleDateString(department.createAt),
        };
      });
    });
  }

  exportCSV() {}
}
