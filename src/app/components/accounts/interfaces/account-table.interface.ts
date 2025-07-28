import { RoleEnum } from '../../../core/enum/role.enum';

// Định nghĩa interface để dùng cho hiển thị dữ liệu trên bảng
export interface IAccountTable {
  accountId: number;
  username: string;
  role: RoleEnum;
  online: string | null;
  Active: boolean;
  createDate: string;
  updateDate: string;
}
