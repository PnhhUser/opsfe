export interface rolesColumn {
  itemId: number;
  key: string;
  selected: boolean;
}

export interface permissionsColumn extends rolesColumn {
  roleId: number;
}

export type SavesRecord = Record<
  number, // roleId
  {
    permissionIds: number[];
  }
>;
