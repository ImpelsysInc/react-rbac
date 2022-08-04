import { Permission, errors } from "../constants";
import { useContext } from "react";
import { RBACContext } from "../context";

/**
 * useRBACContext
 *
 * @author Abhisek Pattnaik
 *
 * @version 1.0.0
 *
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * const component: FunctionComponent = () => {
 *     const { permissions } = useRBACContext(defaultPermissions | undefined);
 *     return <div>{permissions}</div>
 * }
 * ```
 *
 * @example
 * ```tsx
 * const component: FunctionComponent = () => {
 *     const { setPermissions } = useRBACContext();
 *     setPermissions(Permission[])
 *     return <div />
 * }
 * ```
 *
 * @param {Permission[]} [defaultPermissions=null] - Default permissions
 */
export const useRBACContext = (
  defaultPermissions: Permission[] | null = null
) => {
  const rbac = useContext(RBACContext);

  if (!rbac) {
    throw errors.ERROR_MISUSE_CONTEXT;
  }

  return rbac;
};
