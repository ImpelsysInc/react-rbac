import { ErrorMessage } from "./constants";
import { RBACError } from "./error";
import { Action } from "../Action";

export const ERR_INVALID_ACTION = (action: Action) =>
  new RBACError(
    ErrorMessage.RBAC_INVALID_ACTION(action),
    "RBAC_INVALID_ACTION",
    400
  );
