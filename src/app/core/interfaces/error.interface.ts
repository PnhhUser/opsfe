export interface IError {
  message: string;
  statusCode?: number;
  success?: boolean;
  timestamp?: number;
  path?: string;
  source?: 'checkAuth' | 'manual';
}
