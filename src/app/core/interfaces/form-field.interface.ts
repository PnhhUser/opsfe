import { roleEnum } from '../../components/accounts/models/add-account.model';

export interface IFormField<K extends string = string> {
  name: K;
  label: string;
  type: 'text' | 'select' | 'checkbox' | 'password' | 'email' | 'date';
  required?: boolean;
  default?: string | boolean | null | roleEnum;
  options?: { label: string; value: any }[]; // dành cho select
}
