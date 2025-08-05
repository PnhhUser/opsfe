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
  ICellRendererParams,
  RowClickedEvent,
} from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { ActionPosition } from '../../store/positions/position.actions';
import { ILoadPosition } from '../../core/interfaces/position.interface';
import { selectPositions } from '../../store/positions/position.selector';
import { DatetimeUtils } from '../../core/utils/datetime.utils';
import { Observable } from 'rxjs';

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

  rowData: ILoadPosition[] = [];

  positions$: Observable<ILoadPosition[]>;

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

  columnDefs: ColDef<ILoadPosition>[] = [
    {
      field: 'name',
      headerName: 'Position',
      sortable: true,
      filter: true,
      minWidth: 140,
    },
    {
      field: 'key',
      headerName: 'Code',
      sortable: true,
      filter: true,
      minWidth: 140,
    },
    {
      field: 'departmentName',
      headerName: 'Department',
      sortable: true,
      filter: true,
      minWidth: 140,
    },
    {
      field: 'description',
      headerName: 'Description',
      sortable: true,
      minWidth: 140,
    },
    {
      field: 'baseSalary',
      headerName: 'Base salary',
      sortable: true,
      minWidth: 140,
    },
    {
      field: 'createAt',
      headerName: 'Create date',
      sortable: true,
      minWidth: 140,
    },
    {
      field: 'updateAt',
      headerName: 'Update date',
      sortable: true,
      minWidth: 140,
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

    this.positions$ = this.store.select(selectPositions);
  }

  ngOnInit() {
    this.loadData();

    // Lắng nghe sự kiện khi người dùng click bên ngoài table
    document.addEventListener('click', this.onDocumentClick);
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
    const positionId = event.data.positionId;
    this.selectPositionId = { id: positionId };
  }

  loadData() {
    this.store.dispatch(ActionPosition.loadPositions());

    this.positions$.subscribe((positions: ILoadPosition[]) => {
      this.rowData = positions.map((position) => {
        return {
          positionId: position.positionId,
          name: position.name,
          key: position.key,
          departmentName: position.departmentName,
          baseSalary: position.baseSalary,
          description: position.description,
          updateAt: DatetimeUtils.toLocaleDateString(position.updateAt),
          createAt: DatetimeUtils.toLocaleDateString(position.createAt),
        };
      });
    });
  }

  exportCSV() {}

  onDocumentClick = (event: MouseEvent) => {
    const gridElement = document.querySelector('ag-grid-angular');
    if (gridElement && !gridElement.contains(event.target as Node)) {
      this.gridApi?.deselectAll();
      this.selectPositionId = null; // reset khi click ra ngoài
    }
  };

  ngOnDestroy() {
    // Remove listener để tránh memory leak
    document.removeEventListener('click', this.onDocumentClick);
  }
}
