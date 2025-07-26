import { RoleEnum } from '../enum/role.enum';

export interface IField<K extends string = string> {
  name: K;
  label: string;
  type: 'text' | 'select' | 'checkbox' | 'password' | 'email' | 'date';
  required?: boolean;
  default?: string | boolean | null | RoleEnum;
  options?: { label: string; value: any }[]; // dành cho select
}
