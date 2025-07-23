// Định nghĩa interface để dùng cho hiển thị dữ liệu trên bảng
export interface IAccountTable {
  accountId: number;
  username: string;
  role: string;
  online: string | null;
  Active: boolean;
  createDate: string;
  UpdateDate: string;
}
