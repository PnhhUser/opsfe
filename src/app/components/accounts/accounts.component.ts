// Import các module cần thiết từ Angular, Router, AG Grid và các service/model nội bộ
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
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
import { AccountService } from '../../core/services/account.service';
import { IAccount } from '../../core/interfaces/account.interface';
import { RoleEnum } from '../../core/enum/role.enum';
import { IAccountTable } from './interfaces/account-table.interface';

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

  // Định nghĩa các cột hiển thị trong AG Grid
  columnDefs: ColDef<IAccountTable>[] = [
    { field: 'username', sortable: true, filter: true },
    { field: 'role', sortable: true },
    // Hiển thị Active/InActive có màu
    {
      field: 'Active',
      sortable: true,
      cellRenderer: (params: ICellRendererParams) => {
        const isActive = params.value;
        const color = isActive ? 'green' : 'red';
        const label = isActive ? 'Active' : 'Inactive';
        return `<span style="color: ${color}; font-weight: bold;">${label}</span>`;
      },
    },

    // Hiển thị Online/Offline có màu
    {
      field: 'online',
      sortable: true,
      cellRenderer: (params: ICellRendererParams) => {
        const online = params.value;
        const color = online ? 'green' : 'red';
        const label = online ? 'Yes' : 'No';
        return `<span style="color: ${color}; font-weight: bold;">${label}</span>`;
      },
    },

    // Hiển thị ngày tạo và ngày cập nhật
    { field: 'createDate', sortable: true },
    { field: 'UpdateDate', sortable: true },
  ];

  // Dữ liệu hàng cho bảng
  rowData: IAccountTable[] = [];

  // Cấu hình chung của AG Grid
  gridOptions: GridOptions = {
    rowSelection: 'single',
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50, 100],
  };

  // Inject các service cần thiết
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService
  ) {
    // Lấy breadcrumb từ route cha để hiển thị label quay về
    const breadcrumb = this.activatedRoute.snapshot.parent?.data['breadcrumb'];
    this.parentLabel = breadcrumb ? `Back to ${breadcrumb}` : 'Back';
    this.prefixRouter = this.router.url;
  }

  // Gọi khi component được khởi tạo
  ngOnInit() {
    this.loadData();
    // Bỏ chọn khi click ra ngoài grid
    document.addEventListener('click', this.onDocumentClick);
  }

  ngOnDestroy() {
    // Remove listener để tránh memory leak
    document.removeEventListener('click', this.onDocumentClick);
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
    this.accountService.getAccounts().subscribe((res) => {
      const data = res.data;
      this.rowData = data.map((account: IAccount) => ({
        accountId: account.accountId,
        role: account.roleId === RoleEnum.admin ? 'admin' : 'user',
        username: account.username,
        Active: account.isAction,
        createDate: this.toLocaleDateString(account.createdAt),
        UpdateDate: this.toLocaleDateString(account.updatedAt),
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

  onDocumentClick = (event: MouseEvent) => {
    const gridElement = document.querySelector('ag-grid-angular');
    if (gridElement && !gridElement.contains(event.target as Node)) {
      this.gridApi?.deselectAll();
      this.selectAccountId = null; // reset khi click ra ngoài
    }
  };
}
