export const Action = {
  CREATE: "post",
  READ: "get",
  LIST: "get.all",
  PATCH: "update",
  UPDATE: "update.all",
  DELETE: "delete",
  DELETE_ALL: "delete.all",
  RESTORE: "restore",
  RESTORE_ALL: "restore.all",
  ANY: "*",
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Action = typeof Action[keyof typeof Action];
