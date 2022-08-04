import { ErrorMessage } from "./constants";
import { RBACError } from "./error";

export const ERR_INVALID_RESOURCE = (resource: string) =>
  new RBACError(
    ErrorMessage.RBAC_INVALID_RESOURCE(resource),
    "RBAC_INVALID_RESOURCE",
    400
  );
