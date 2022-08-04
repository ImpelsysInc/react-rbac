import { useCallback } from "react";
import { RBACContextValue } from "../context";
import { Permission } from "../constants";
import { usePermissions } from "./usePermissions";
import {canAccess2} from "../utils/canAccess";

export interface RBACOptions {
  permissions?: Permission[] | null;
  getPermissions?: () => Promise<Permission[]>;
}

/**
 * useRBAC
 *
 * @description Pass the return value of this hook to the RBACProvider `value` prop.
 *
 * @version 1.0.0
 *
 * @since 1.0.0
 *
 * @author Abhisek Pattnaik
 *
 * @example
 * ```tsx
 * const app: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
 *     const rbac = useRBAC();
 *     return <RBACProvider value={rbac}>{children}</RBACProvider>
 * }
 * ```
 *
 * @param {RBACOptions} rbac - Options for RBAC
 *
 * @param {Permission[]} rbac.permissions - RBAC permissions
 *
 * @returns {RBACContextValue} Value to be passed to RBACProvider `value` prop.
 */
export const useRBAC = ({
  permissions: defaultPermissions = null,
  getPermissions,
}: RBACOptions = {}): RBACContextValue => {
  const {
    setPermissions,
    clearPermissions,
    permissions,
    loading: loadingPermissions,
    permissionError,
  } = usePermissions({ defaultPermissions, getPermissions });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const canAccess = useCallback(canAccess2(permissions), [permissions]);

  return {
    loadingPermissions,
    permissions,
    permissionError,
    setPermissions,
    clearPermissions,
    canAccess,
  };
};
