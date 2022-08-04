import {
  Permission,
  errors,
  PermissionString,
  PermissionType,
  PermissionTypeAlias,
} from "../constants";

/**
 * parsePermission
 *
 * @version 1.0.0
 *
 * @since 1.0.0
 *
 * @author Abhisek Pattnaik
 *
 * @param permission
 */
export const parsePermission = (permission: PermissionString): Permission[] => {
  const rePermission =
    /^(?<type>[+-])?\s*(?<resource>(([\w-]+|\*)(\.([\w-]+|\*))*)(\s*,?\s*([\w-]+|\*)(\.([\w-]+|\*))*))\s*(\(\s*(?<resourceType>[\w\s.-]+|\*)\s*\))?\s*:\s*(?<actions>(([\w-]+|\*)(\.([\w-]+))*)(\s*,\s*(([\w-]+|\*)(\.([\w-]+))*))*)+$\s*/gimu;

  // Semi-colon separated permissions
  const permissionParts = permission.split(/\s*;\s*/);

  const permissions: Permission[] = permissionParts.map(
    (permissionString: PermissionString) => {
      const match = rePermission.exec(permissionString.trim());

      if (!match) {
        throw errors.ERR_INVALID_PERMISSION(permissionString);
      }

      const {
        // @ts-ignore
        groups: { type, resource, resourceType, actions },
      } = match;

      return {
        type:
          PermissionTypeAlias[type?.trim() as PermissionTypeAlias] ??
          PermissionType.ALLOW,
        resource: resource?.trim(),
        resourceType: resourceType?.trim(),
        action: actions
          .split(/\s*,\s*/)
          .map((action: string) => action.trim())
          .filter(Boolean),
      };
    }
  );

  return permissions;
};
