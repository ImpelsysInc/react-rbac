import { useCallback, useReducer } from "react";
import { Permission, PermissionString } from "../constants";
import { parsePermission } from "../utils/parsePermission";

interface PermissionReducerState {
  permissions: null | Permission[];
  permissionError: null | Error;
  loading: boolean;
}

type PermissionReducerAction =
  | {
      type: "loaded";
      error?: Error;
      permissions?: null | Permission[];
    }
  | {
      type: "loading";
    };

const permissionReducer = (
  state: PermissionReducerState,
  action: PermissionReducerAction
) => {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        permissionError: null,
        loading: true,
      };
    case "loaded":
      const permissions = action.permissions ?? state.permissions;
      return {
        ...state,
        permissions,
        permissionError: action.error ?? null,
        loading: false,
      };
    default:
      return state;
  }
};

export interface UsePermissionsOptions {
  defaultPermissions: null | Permission[] | PermissionString;
  getPermissions?: () => Promise<Permission[] | PermissionString>;
}

export const usePermissions = ({
  getPermissions,
  defaultPermissions,
}: UsePermissionsOptions) => {
  const permissions =
    typeof defaultPermissions === "string"
      ? parsePermission(defaultPermissions)
      : defaultPermissions;
  const [state, dispatch] = useReducer(permissionReducer, {
    permissions,
    permissionError: null,
    loading: false,
  });

  if (getPermissions) {
    dispatch({ type: "loading" });
    getPermissions()
      .then((permissions) => {
        dispatch({
          type: "loaded",
          permissions: Array.isArray(permissions)
            ? permissions
            : parsePermission(permissions),
        });
      })
      .catch((err) => {
        dispatch({ type: "loaded", error: err });
      });
  }

  const clearPermissions = useCallback(() => {
    dispatch({ type: "loaded", permissions: null });
  }, []);

  const setPermissions = useCallback((permissions: Permission[]) => {
    dispatch({ type: "loaded", permissions });
  }, []);

  return {
    loading: state.loading,
    permissions: state.permissions,
    permissionError: state.permissionError,
    setPermissions,
    clearPermissions,
  };
};
