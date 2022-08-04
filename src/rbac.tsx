import React, { FunctionComponent, ReactNode } from "react";
import { RBACContext, RBACContextValue } from "./context";

export interface RBACProviderProps {
  children?: ReactNode;
  rbac: RBACContextValue;
}

/**
 * RBACProvider
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
 * @param {ReactNode} children
 *
 * @param {RBACContextValue} props - value from useRBAC()
 */
export const RBACProvider: FunctionComponent<RBACProviderProps> = ({
  children,
  rbac,
}) => {
  return <RBACContext.Provider value={rbac}>{children}</RBACContext.Provider>;
};
