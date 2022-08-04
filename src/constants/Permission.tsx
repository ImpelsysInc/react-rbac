import { PermissionType } from "./PermissionType";
import { Action } from "./Action";
import { ResourceType } from "./ResourceType";

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
export type PermissionString = string;

/**
 * Permission
 *
 * @author Abhisek Pattnaik
 *
 * @version 1.0.0
 *
 * @since 1.0.0
 */
export interface Permission {
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
  resource: /*string[] | */string;

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
