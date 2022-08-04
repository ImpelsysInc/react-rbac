import { ReactNode, FunctionComponent } from 'react';

declare const PermissionType: {
    readonly ALLOW: "allow";
    readonly DENY: "deny";
};
declare type PermissionType = typeof PermissionType[keyof typeof PermissionType] | string;
declare const PermissionTypeAlias: {
    readonly "-": "deny";
    readonly "+": "allow";
};
declare type PermissionTypeAlias = keyof typeof PermissionTypeAlias;

declare const Action: {
    readonly CREATE: "post";
    readonly READ: "get";
    readonly LIST: "get.all";
    readonly PATCH: "update";
    readonly UPDATE: "update.all";
    readonly DELETE: "delete";
    readonly DELETE_ALL: "delete.all";
    readonly RESTORE: "restore";
    readonly RESTORE_ALL: "restore.all";
    readonly ANY: "*";
};
declare type Action = typeof Action[keyof typeof Action];

declare const ResourceType: {
    readonly MENU: "menu";
    readonly PAGE: "page";
    readonly COMPONENT: "component";
    readonly API: "api";
    readonly ANY: "*";
};
declare type ResourceType = typeof ResourceType[keyof typeof ResourceType];

/**
 * PermissionString
 *
 * @description
 * - Semi-colon separated list of permissions (linear spacing will be ignored).
 * - Optionally, a resource type can be specified within parentheses.
 * - Comma-separated list of actions.
 * - Permission alias (+|-) can be specified to signify ALLOW|DENY respectively.
 *   Permission type is "allow" by default when nothing is specified.
 *
 * @example
 * `+resource1(resourceType):action1; resource2:action1; -resource3(page):action1,action2; +resource4(component):action1,action2`
 *
 * @example 1
 * "product:get.all,get; user(menu):get.all"
 *
 * @example
 * "product:get.all,get; -user(page):get.all,update.all"
 */
declare type PermissionString = string;
/**
 * Permission
 *
 * @author Abhisek Pattnaik
 *
 * @version 1.0.0
 *
 * @since 1.0.0
 */
interface Permission {
    /**
     * type
     *
     * @description The type of the permission.
     *
     * @default "allow"
     *
     * @example
     * "allow"
     *
     * @example
     * "deny"
     */
    type?: PermissionType;
    /**
     * action
     *
     * @description Different types of actions that can be performed on a resource.
     * @example 1
     * ["get", "get.all"]
     *
     * @example 2
     * "update"
     *
     * @example 3
     * ["update", "update.all"]
     */
    action: Action[] | Action | string | string[];
    /**
     * @description Resource type
     *
     * @example 1
     * "product"
     *
     * @example 2
     * ["product.description", "product.*", "product"]
     */
    resource: string;
    /**
     * @description Resource Type
     *
     * @default "*"
     *
     * @example 1
     * "menu"
     *
     * @example 2
     * "page"
     *
     * @example 3
     * "component"
     *
     * @example 4
     * "api"
     *
     * @example 5
     * "*"
     */
    resourceType?: ResourceType | string;
    /**
     * record
     *
     * @description Provides the context of the permission.
     *
     * @example 1
     * {userId: 1}
     *
     * @example 2
     * {userId: 1, groupId: 2}
     */
    record?: Record<any, any>;
    /**
     * Any other metadata
     */
    [meta: string]: any;
}

/**
 * Base class which RBAC errors inherit from.
 *
 * @protected
 */
declare class RBACError extends Error {
    code: string;
    statusCode: number;
    constructor(message: string, code: string, statusCode: number);
}

declare const ERROR_MISUSE_CONTEXT: RBACError;

declare const ERR_INVALID_PERMISSION: (permission: string) => RBACError;

declare const ERR_INVALID_ACTION: (action: Action) => RBACError;

declare const ERR_INVALID_RESOURCE: (resource: string) => RBACError;

declare const index_ERROR_MISUSE_CONTEXT: typeof ERROR_MISUSE_CONTEXT;
declare const index_ERR_INVALID_PERMISSION: typeof ERR_INVALID_PERMISSION;
declare const index_ERR_INVALID_ACTION: typeof ERR_INVALID_ACTION;
declare const index_ERR_INVALID_RESOURCE: typeof ERR_INVALID_RESOURCE;
declare namespace index {
  export {
    index_ERROR_MISUSE_CONTEXT as ERROR_MISUSE_CONTEXT,
    index_ERR_INVALID_PERMISSION as ERR_INVALID_PERMISSION,
    index_ERR_INVALID_ACTION as ERR_INVALID_ACTION,
    index_ERR_INVALID_RESOURCE as ERR_INVALID_RESOURCE,
  };
}

interface RBACContextValue {
    loadingPermissions: boolean;
    permissions: Permission[] | null;
    permissionError: Error | null;
    setPermissions: (permissions: Permission[]) => void;
    clearPermissions: () => void;
    canAccess: (permission: Permission | string) => boolean;
}

interface RBACProviderProps {
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
declare const RBACProvider: FunctionComponent<RBACProviderProps>;

interface RBACOptions {
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
declare const useRBAC: ({ permissions: defaultPermissions, getPermissions, }?: RBACOptions) => RBACContextValue;

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
declare const useRBACContext: (defaultPermissions?: Permission[] | null) => RBACContextValue;

interface UsePermissionsOptions {
    defaultPermissions: null | Permission[] | PermissionString;
    getPermissions?: () => Promise<Permission[] | PermissionString>;
}
declare const usePermissions: ({ getPermissions, defaultPermissions, }: UsePermissionsOptions) => {
    loading: boolean;
    permissions: Permission[] | null;
    permissionError: Error | null;
    setPermissions: (permissions: Permission[]) => void;
    clearPermissions: () => void;
};

declare type WithPermissionProps = {
    children: ReactNode;
} & Permission;
declare const WithPermission: FunctionComponent<WithPermissionProps>;

export { Action, Permission, PermissionString, PermissionType, PermissionTypeAlias, RBACOptions, RBACProvider, RBACProviderProps, ResourceType, UsePermissionsOptions, WithPermission, WithPermissionProps, index as errors, usePermissions, useRBAC, useRBACContext };
