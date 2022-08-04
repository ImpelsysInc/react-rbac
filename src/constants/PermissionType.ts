export const PermissionType = {
  ALLOW: "allow",
  DENY: "deny",
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PermissionType =
  | typeof PermissionType[keyof typeof PermissionType]
  | string;

export const PermissionTypeAlias = {
  "-": PermissionType.DENY,
  "+": PermissionType.ALLOW,
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PermissionTypeAlias =
  keyof typeof PermissionTypeAlias;
