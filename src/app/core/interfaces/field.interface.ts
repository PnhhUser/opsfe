import { Gender } from '../enum/gender.enum';
import { RoleEnum } from '../enum/role.enum';

export interface IField<K extends string = string> {
  name: K;
  label: string;
  type:
    | 'text'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'password'
    | 'email'
    | 'date'
    | 'hidden'
    | 'number';
  required?: boolean;
  money?: boolean;
  default?: string | boolean | null | RoleEnum | Gender;
  options?: { label: string; value: any }[]; // dành cho select
}
