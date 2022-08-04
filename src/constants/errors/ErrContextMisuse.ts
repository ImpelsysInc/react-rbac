import { ErrorMessage } from "./constants";
import { RBACError } from "./error";

export const ERROR_MISUSE_CONTEXT = new RBACError(
  ErrorMessage.RBAC_CONTEXT_MISUSE,
  "RBAC_CONTEXT_MISUSE",
  400
);
