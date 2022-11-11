import { createContext } from "react";
import { Permission } from "./constants";

export interface RBACContextValue {
  loadingPermissions: boolean;
  permissions: Permission[] | null;
  permissionError: Error | null;
  setPermissions: (permissions: Permission[]) => void;
  clearPermissions: () => void;
  canAccess: (permission: Permission | string) => boolean;
}

/**
 * RBACContext
 *
 * @version 1.0.0
 *
 * @since 1.0.0
 *
 * @author Abhisek Pattnaik
 *
 * @example
 * ```tsx
 * <RBACContext.Provider>{children}</RBACContext.Provider>
 * ```
 *
 * @description Stores the state of the RBAC
 *
 * @protected
 **/
export const RBACContext = createContext<RBACContextValue | null>(null);
