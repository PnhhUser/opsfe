import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowClickedEvent,
} from 'ag-grid-community';

// Đăng ký module AG Grid community
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './table.component.html',
})
export class TableComponent<T> {
  // Đầu vào
  @Input() columnField: ColDef<T>[] = [];
  @Input() data: T[] = [];
  @Input() itemId: string = '';

  // Đầu ra
  @Output() rowSelected = new EventEmitter<{ id: number } | null>();
  @Output() girdEvent = new EventEmitter<{ event: GridReadyEvent }>();

  gridApi!: GridApi;
  selectItem: { id: number } | null = null;

  // Cấu hình chung của AG Grid
  gridOptions: GridOptions = {
    rowSelection: 'single',
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [5, 10, 20, 50, 100],
    domLayout: 'autoHeight',
  };

  rowData: T[] = [];

  columnDefs: ColDef<T>[] = [];

  ngOnInit() {
    document.addEventListener('click', this.onDocumentClick);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.rowData = [...this.data];
    }

    if (changes['columnField']) {
      this.columnDefs = [...this.columnField];
    }
  }

  resizeColumns() {
    this.gridApi?.sizeColumnsToFit();
  }

  // Load lần đầu và duy nhất ở table
  onGridReady(event: GridReadyEvent) {
    this.gridApi = event.api;
    this.resizeColumns();

    this.girdEvent.emit({ event });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    setTimeout(() => this.resizeColumns(), 100);
  }

  // Bắt sự kiện khi click vào từng dòng
  onRowClicked(event: RowClickedEvent) {
    const id = event.data?.[this.itemId];
    this.selectItem = { id };
    this.rowSelected.emit(this.selectItem);
  }

  // hàm sự kiện khi click trên màn hình
  onDocumentClick = (event: MouseEvent) => {
    const gridElement = document.querySelector('ag-grid-angular');

    if (gridElement && !gridElement.contains(event.target as Node)) {
      if (this.gridApi) {
        this.gridApi.deselectAll();
      }
      this.selectItem = null; // reset khi click ra ngoài
      this.rowSelected.emit(this.selectItem);
    }
  };

  // hủy đi sự kiện click màn hình
  ngOnDestroy() {
    // Remove listener để tránh memory leak
    document.removeEventListener('click', this.onDocumentClick);
  }
}
