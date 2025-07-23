export interface IResponseCustom<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: number;
}
