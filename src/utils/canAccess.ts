import {
  Action,
  Permission,
  PermissionString,
  PermissionType,
} from "../constants";
import { curryN } from "lodash/fp";
import { parsePermission } from "./parsePermission";
import { parseResource } from "./parseResource";

/**
 * canAccess
 *
 * @description Iterate through all the permissions and check if the permission is allowed or not.
 *
 * @version 1.0.0
 *
 * @since 1.0.0
 *
 * @author Abhisek Pattnaik
 *
 * @param {Permission[]} permissions - List of all permissions.
 *
 * @param {Permission} permission - The permission to check against.
 * If [`PermissionString`](PermissionString) is passed, it will be parsed and only the first permission will be considered.
 *
 * @returns {boolean} Whether the permission is allowed or not.
 */
export const canAccess = curryN(
  2,
  (
    permissions: PermissionString | Permission[],
    permission: PermissionString | Permission
  ): boolean => {
    // Parse permission (normalize to Permission[])
    const permissionList = Array.isArray(permissions)
      ? permissions
      : parsePermission(permissions);

    // Parse my permission (normalize to string)
    const myPermission =
      typeof permission == "string"
        ? parsePermission(permission)[0]
        : permission;

    // Iterate through all the permissions and check if the permission is allowed.
    return permissionList.every((p) => {
      if (!p.type) {
        p.type = PermissionType.ALLOW;
      }

      // Normalize `resource`
      // @ts-ignore
      const resources = [].concat(p.resource);
      // @ts-ignore
      const myResources = [].concat(myPermission.resource);

      // Parse Resource(s)
      const resourceParts = resources.map(parseResource);
      const myResourceParts = myResources.map(parseResource);

      const resource = resourceParts[0];
      const myResource = myResourceParts[0];

      // FIXME
      // Check if my resource is in the resource list
      // And if my resource part is contained by the original resource part
      /*myResourceParts.every((myResourcePart) => {
        return resourceParts.some((resourcePart) => {
          return resourcePart.every((part, index) => {
            return part === "*" || part === myResourcePart[index];
          });
        });
      });*/

      if (p.resourceType && p.resourceType !== myPermission.resourceType) {
        return true;
      }

      // FIXME
      return (
        []
          // @ts-ignore
          .concat(p.action)
          .some((action) => myPermission.action.includes(action)) &&
        p.type === PermissionType.ALLOW
      );
    });
  }
);

/**
 *
 * @param {Permission} permission - The permission to check against.
 * If [`PermissionString`](PermissionString) is passed, it will be parsed and only the first permission will be considered.
 *
 * @returns {boolean} Whether the permission is allowed or not.
 */
type canAccess2ReturnFn = (
  permission: PermissionString | Permission
) => boolean;

/**
 * canAccess2
 *
 * @description Iterate through all the permissions and check if the permission is allowed or not.
 *
 * @todo Support for multiple resources.
 *
 * @todo Support for DENY permissions
 *
 * @todo Support for resource wildcards.
 *
 * @version 1.0.0
 *
 * @since 1.0.0
 *
 * @author Abhisek Pattnaik
 *
 * @param {Permission[]} permissions - List of all permissions.
 */
export const canAccess2 = (
  permissions: PermissionString | Permission[] | null
): canAccess2ReturnFn => {
  if (permissions == null) {
    return (any) => false;
  }

  // Parse permission (normalize to Permission[])
  const permissionList = Array.isArray(permissions)
    ? permissions
    : parsePermission(permissions);

  const permissionMap = permissionList.reduce((acc, p) => {
    // @ts-ignore
    const resource = [].concat(p.resource)[0];
    // @ts-ignore
    const actions = [].concat(p.action);

    const type = p.type ?? PermissionType.ALLOW;

    const actionsWithPermissionType = actions.map((action) =>
      type === PermissionType.ALLOW ? `+${action}` : `-${action}`
    );

    const resourceWithType = p.resourceType
      ? `${resource}(${p.resourceType})`
      : resource;

    acc[resourceWithType] = acc[resourceWithType]
      ? Array.from(
          new Set([...acc[resourceWithType], ...actionsWithPermissionType])
        )
      : Array.from(new Set(actionsWithPermissionType));

    return acc;
  }, {} as { [key: string]: string[] });

  return (permission: PermissionString | Permission) => {
    // Parse my permission (normalize to string)
    const myPermission =
      typeof permission == "string"
        ? parsePermission(permission)[0]
        : permission;

    // @ts-ignore
    const myResource = [].concat(myPermission.resource)[0];

    const myType = myPermission.type ?? PermissionType.ALLOW;

    const myActions = []
      // @ts-ignore
      .concat(myPermission.action)
      .map((action) =>
        myType === PermissionType.ALLOW ? `+${action}` : `-${action}`
      );

    const resourceWithType = myPermission.resourceType
      ? `${myResource}(${myPermission.resourceType})`
      : myResource;

    const actionsWithResourceType = permissionMap[resourceWithType];
    const actions = permissionMap[myResource];

    return (
      myActions.every(
        (myAction) =>
          actionsWithResourceType?.includes?.(myAction) ||
          actionsWithResourceType?.includes?.(`+${Action.ANY}`)
      ) ||
      myActions.every(
        (myAction) =>
          actions?.includes?.(myAction) || actions?.includes?.(`+${Action.ANY}`)
      )
    );
  };
};
