import React, { createContext, useReducer, useCallback, useContext } from 'react';
import dedent from 'dedent';
import { curryN } from 'lodash/fp';

const RBACContext = createContext(null);

const RBACProvider = ({
  children,
  rbac
}) => {
  return /* @__PURE__ */ React.createElement(RBACContext.Provider, {
    value: rbac
  }, children);
};

const Action = {
  CREATE: "post",
  READ: "get",
  LIST: "get.all",
  PATCH: "update",
  UPDATE: "update.all",
  DELETE: "delete",
  DELETE_ALL: "delete.all",
  RESTORE: "restore",
  RESTORE_ALL: "restore.all",
  ANY: "*"
};

const PermissionType = {
  ALLOW: "allow",
  DENY: "deny"
};
const PermissionTypeAlias = {
  "-": PermissionType.DENY,
  "+": PermissionType.ALLOW
};

const ResourceType = {
  MENU: "menu",
  PAGE: "page",
  COMPONENT: "component",
  API: "api",
  ANY: "*"
};

const ErrorMessage = {
  RBAC_CONTEXT_MISUSE: "useRBACContext must be used within a RBACProvider",
  RBAC_INVALID_PERMISSION: (permission) => dedent`
    Invalid permission format for "${permission}". 
    Each semicolon separated permission should be in the format:
        "+resource(resourceType):action1,action2,action3; -resource(resourceType):action1,action2,action3; ..."
    Allowed characters for resource, resourceType and actions are:
        \`a-z, A-Z, 0-9, underscore(_), hyphen(-), and period(.)\`
    `,
  RBAC_INVALID_ACTION: (action) => dedent`
    Invalid action format for "${action}".
    Action should be in the format:
      "get.all"
      "get"
      "create"
  `,
  RBAC_INVALID_RESOURCE: (resource) => dedent`
    Invalid resource format for "${resource}".
    Resource should be in the format:
      "product.*"
      "product.description"
      "product"
  `
};

class RBACError extends Error {
  constructor(message, code, statusCode) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

const ERROR_MISUSE_CONTEXT = new RBACError(
  ErrorMessage.RBAC_CONTEXT_MISUSE,
  "RBAC_CONTEXT_MISUSE",
  400
);

const ERR_INVALID_PERMISSION = (permission) => new RBACError(
  ErrorMessage.RBAC_INVALID_PERMISSION(permission),
  "RBAC_INVALID_PERMISSION",
  400
);

const ERR_INVALID_ACTION = (action) => new RBACError(
  ErrorMessage.RBAC_INVALID_ACTION(action),
  "RBAC_INVALID_ACTION",
  400
);

const ERR_INVALID_RESOURCE = (resource) => new RBACError(
  ErrorMessage.RBAC_INVALID_RESOURCE(resource),
  "RBAC_INVALID_RESOURCE",
  400
);

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ERROR_MISUSE_CONTEXT: ERROR_MISUSE_CONTEXT,
  ERR_INVALID_PERMISSION: ERR_INVALID_PERMISSION,
  ERR_INVALID_ACTION: ERR_INVALID_ACTION,
  ERR_INVALID_RESOURCE: ERR_INVALID_RESOURCE
});

const parsePermission = (permission) => {
  const rePermission = /^(?<type>[+-])?\s*(?<resource>(([\w-]+|\*)(\.([\w-]+|\*))*)(\s*,?\s*([\w-]+|\*)(\.([\w-]+|\*))*))\s*(\(\s*(?<resourceType>[\w\s.-]+|\*)\s*\))?\s*:\s*(?<actions>(([\w-]+|\*)(\.([\w-]+))*)(\s*,\s*(([\w-]+|\*)(\.([\w-]+))*))*)+$\s*/gimu;
  const permissionParts = permission.split(/\s*;\s*/);
  const permissions = permissionParts.map(
    (permissionString) => {
      const match = rePermission.exec(permissionString.trim());
      if (!match) {
        throw ERR_INVALID_PERMISSION(permissionString);
      }
      const {
        groups: { type, resource, resourceType, actions }
      } = match;
      return {
        type: PermissionTypeAlias[type?.trim()] ?? PermissionType.ALLOW,
        resource: resource?.trim(),
        resourceType: resourceType?.trim(),
        action: actions.split(/\s*,\s*/).map((action) => action.trim()).filter(Boolean)
      };
    }
  );
  return permissions;
};

const permissionReducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        permissionError: null,
        loading: true
      };
    case "loaded":
      const permissions = action.permissions ?? state.permissions;
      return {
        ...state,
        permissions,
        permissionError: action.error ?? null,
        loading: false
      };
    default:
      return state;
  }
};
const usePermissions = ({
  getPermissions,
  defaultPermissions
}) => {
  const permissions = typeof defaultPermissions === "string" ? parsePermission(defaultPermissions) : defaultPermissions;
  const [state, dispatch] = useReducer(permissionReducer, {
    permissions,
    permissionError: null,
    loading: false
  });
  if (getPermissions) {
    dispatch({ type: "loading" });
    getPermissions().then((permissions2) => {
      dispatch({
        type: "loaded",
        permissions: Array.isArray(permissions2) ? permissions2 : parsePermission(permissions2)
      });
    }).catch((err) => {
      dispatch({ type: "loaded", error: err });
    });
  }
  const clearPermissions = useCallback(() => {
    dispatch({ type: "loaded", permissions: null });
  }, []);
  const setPermissions = useCallback((permissions2) => {
    dispatch({ type: "loaded", permissions: permissions2 });
  }, []);
  return {
    loading: state.loading,
    permissions: state.permissions,
    permissionError: state.permissionError,
    setPermissions,
    clearPermissions
  };
};

const parseResource = (resource) => {
  const reResource = /^([\w-]+|\*)(\.([\w-]+|\*))*$/gimu;
  const match = reResource.exec(resource);
  if (!match) {
    throw ERR_INVALID_RESOURCE(resource);
  }
  return match;
};

curryN(
  2,
  (permissions, permission) => {
    const permissionList = Array.isArray(permissions) ? permissions : parsePermission(permissions);
    const myPermission = typeof permission == "string" ? parsePermission(permission)[0] : permission;
    return permissionList.every((p) => {
      if (!p.type) {
        p.type = PermissionType.ALLOW;
      }
      const resources = [].concat(p.resource);
      const myResources = [].concat(myPermission.resource);
      const resourceParts = resources.map(parseResource);
      const myResourceParts = myResources.map(parseResource);
      resourceParts[0];
      myResourceParts[0];
      if (p.resourceType && p.resourceType !== myPermission.resourceType) {
        return true;
      }
      return [].concat(p.action).some((action) => myPermission.action.includes(action)) && p.type === PermissionType.ALLOW;
    });
  }
);
const canAccess2 = (permissions) => {
  if (permissions == null) {
    return (any) => false;
  }
  const permissionList = Array.isArray(permissions) ? permissions : parsePermission(permissions);
  const permissionMap = permissionList.reduce((acc, p) => {
    const resource = [].concat(p.resource)[0];
    const actions = [].concat(p.action);
    const type = p.type ?? PermissionType.ALLOW;
    const actionsWithPermissionType = actions.map(
      (action) => type === PermissionType.ALLOW ? `+${action}` : `-${action}`
    );
    const resourceWithType = p.resourceType ? `${resource}(${p.resourceType})` : resource;
    acc[resourceWithType] = acc[resourceWithType] ? Array.from(
      /* @__PURE__ */ new Set([...acc[resourceWithType], ...actionsWithPermissionType])
    ) : Array.from(new Set(actionsWithPermissionType));
    return acc;
  }, {});
  return (permission) => {
    const myPermission = typeof permission == "string" ? parsePermission(permission)[0] : permission;
    const myResource = [].concat(myPermission.resource)[0];
    const myType = myPermission.type ?? PermissionType.ALLOW;
    const myActions = [].concat(myPermission.action).map(
      (action) => myType === PermissionType.ALLOW ? `+${action}` : `-${action}`
    );
    const resourceWithType = myPermission.resourceType ? `${myResource}(${myPermission.resourceType})` : myResource;
    const actionsWithResourceType = permissionMap[resourceWithType];
    const actions = permissionMap[myResource];
    return myActions.every(
      (myAction) => actionsWithResourceType?.includes?.(myAction) || actionsWithResourceType?.includes?.(`+${Action.ANY}`)
    ) || myActions.every(
      (myAction) => actions?.includes?.(myAction) || actions?.includes?.(`+${Action.ANY}`)
    );
  };
};

const useRBAC = ({
  permissions: defaultPermissions = null,
  getPermissions
} = {}) => {
  const {
    setPermissions,
    clearPermissions,
    permissions,
    loading: loadingPermissions,
    permissionError
  } = usePermissions({ defaultPermissions, getPermissions });
  const canAccess = useCallback(canAccess2(permissions), [permissions]);
  return {
    loadingPermissions,
    permissions,
    permissionError,
    setPermissions,
    clearPermissions,
    canAccess
  };
};

const useRBACContext = (defaultPermissions = null) => {
  const rbac = useContext(RBACContext);
  if (!rbac) {
    throw ERROR_MISUSE_CONTEXT;
  }
  return rbac;
};

const WithPermission = ({
  children,
  ...permissionProps
}) => {
  const { canAccess } = useRBACContext();
  if (canAccess(permissionProps)) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
  }
  return null;
};

export { Action, PermissionType, PermissionTypeAlias, RBACProvider, ResourceType, WithPermission, index as errors, usePermissions, useRBAC, useRBACContext };
//# sourceMappingURL=react-rbac.mjs.map
