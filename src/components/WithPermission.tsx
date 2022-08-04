import React, { FunctionComponent, ReactNode } from "react";
import { Permission } from "../constants";
import { useRBACContext } from "../hooks";

export type WithPermissionProps = {
  children: ReactNode;
} & Permission;

export const WithPermission: FunctionComponent<WithPermissionProps> = ({
  children,
  ...permissionProps
}) => {
  const { canAccess } = useRBACContext();

  if (canAccess(permissionProps)) {
    return <>{children}</>;
  }

  return null;
};
