import { ErrorMessage } from "./constants";
import { RBACError } from "./error";

export const ERR_INVALID_PERMISSION = (permission: string) =>
  new RBACError(
    ErrorMessage.RBAC_INVALID_PERMISSION(permission),
    "RBAC_INVALID_PERMISSION",
    400
  );
