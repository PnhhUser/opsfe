// Import các module cần thiết từ Angular, Router, AG Grid và các service/model nội bộ
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  GridOptions,
  GridReadyEvent,
  RowClickedEvent,
  ICellRendererParams,
  GridApi,
} from 'ag-grid-community';
import { CRUDComponent } from '../../shared/components/crud/crud.component';
import { ILoadAccount } from '../../core/interfaces/account.interface';
import { RoleEnum } from '../../core/enum/role.enum';
import { IAccountTable } from './interfaces/account-table.interface';
import { filter } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AccountActions from '../../store/accounts/account.actions';
import { selectAccounts } from '../../store/accounts/account.selectors';

// Đăng ký module AG Grid community
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-account',
  standalone: true,
  templateUrl: './accounts.component.html',
  imports: [CommonModule, AgGridModule, CRUDComponent, RouterOutlet],
})
export class AccountComponent {
  parentLabel = 'Back';
  selectAccountId: { id: number } | null = null;
  gridApi!: GridApi;
  prefixRouter: string;

  accounts$;

  // Định nghĩa các cột hiển thị trong AG Grid
  columnDefs: ColDef<IAccountTable>[] = [
    { field: 'username', sortable: true, filter: true, minWidth: 140 },
    {
      field: 'role',
      sortable: true,
      cellRenderer: (params: ICellRendererParams) => {
        const roleId = Number.parseInt(params.value);
        const isAdmin = roleId === RoleEnum.admin;

        const label = isAdmin ? 'Admin' : 'User';
        const badgeClass = isAdmin
          ? 'bg-red-100 text-red-700'
          : 'bg-blue-100 text-blue-700';

        return `
      <span class="inline-flex items-center justify-center h-6 min-w-[60px] px-3 text-xs font-semibold rounded-full ${badgeClass}">
        ${label}
      </span>
    `;
      },
      minWidth: 100,
    },

    // Active / Inactive badge
    {
      field: 'Active',
      headerName: 'Status',
      sortable: true,
      cellRenderer: (params: ICellRendererParams) => {
        const isActive = params.value;
        const label = isActive ? 'Active' : 'Inactive';
        const badgeClass = isActive
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700';

        return `
      <span class="inline-flex items-center justify-center h-6 min-w-[70px] px-3 text-xs font-semibold rounded-full ${badgeClass}">
        ${label}
      </span>
    `;
      },
      minWidth: 100,
    },

    // Online / Offline badge
    {
      field: 'online',
      headerName: 'Online',
      sortable: true,
      cellRenderer: (params: ICellRendererParams) => {
        const isOnline = params.value;
        const label = isOnline ? 'Online' : 'Offline';
        const badgeClass = isOnline
          ? 'bg-blue-100 text-blue-700'
          : 'bg-gray-200 text-gray-600';

        return `
      <span class="inline-flex items-center justify-center h-6 min-w-[70px] px-3 text-xs font-semibold rounded-full ${badgeClass}">
        ${label}
      </span>
    `;
      },
      minWidth: 100,
    },

    // Hiển thị ngày tạo và ngày cập nhật
    { field: 'createDate', sortable: true, minWidth: 150 },
    { field: 'updateDate', sortable: true, minWidth: 150 },
  ];

  // Dữ liệu hàng cho bảng
  rowData: IAccountTable[] = [];

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

  // Inject các service cần thiết
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    // Lấy breadcrumb từ route cha để hiển thị label quay về
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : 'Back';
    this.prefixRouter = this.router.url;

    this.accounts$ = this.store.select(selectAccounts);
  }

  // Gọi khi component được khởi tạo
  ngOnInit() {
    this.loadData();

    // Lắng nghe điều hướng quay về chính route này
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isParentRoute()) {
          this.loadData(); // Reload dữ liệu
        }
      });

    // Bỏ chọn khi click ra ngoài grid
    document.addEventListener('click', this.onDocumentClick);
  }

  // Kiểm tra có đang ở route cha hay không
  isParentRoute(): boolean {
    const currentRoute = this.activatedRoute;
    return !currentRoute.firstChild;
  }

  // Xử lý quay lại route cha
  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  // Gọi khi bảng khởi tạo lần đầu
  onGridReady(event: GridReadyEvent) {
    this.gridApi = event.api;
    event.api.sizeColumnsToFit(); // Tự động fit cột
  }

  // Gọi API để lấy dữ liệu tài khoản và gán vào rowData
  loadData() {
    this.store.dispatch(AccountActions.loadAccount());
    this.accounts$.subscribe((accounts: ILoadAccount[]) => {
      this.rowData = accounts.map((account: ILoadAccount) => ({
        accountId: account.accountId,
        role: account.role,
        username: account.username,
        Active: account.isAction,
        createDate: this.toLocaleDateString(account.createdAt),
        updateDate: this.toLocaleDateString(account.updatedAt),
        online: account.lastseen,
      }));
    });
  }

  // Xử lý sự kiện click vào dòng trong bảng
  onRowClicked(event: RowClickedEvent) {
    const accountId = event.data.accountId;
    this.selectAccountId = { id: accountId };
  }

  // Chuyển đổi ngày ISO sang định dạng ngày + giờ tiếng Việt
  private toLocaleDateString(datetime: string) {
    return new Date(datetime).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  // xuất CSV
  exportCSV() {
    if (!this.gridApi) return;

    this.gridApi.exportDataAsCsv({
      fileName: 'DanhSachTaiKhoan.csv',
    });
  }

  onDocumentClick = (event: MouseEvent) => {
    const gridElement = document.querySelector('ag-grid-angular');
    if (gridElement && !gridElement.contains(event.target as Node)) {
      this.gridApi?.deselectAll();
      this.selectAccountId = null; // reset khi click ra ngoài
    }
  };

  ngOnDestroy() {
    // Remove listener để tránh memory leak
    document.removeEventListener('click', this.onDocumentClick);
  }
}
