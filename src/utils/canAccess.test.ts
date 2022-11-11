import { canAccess2 as canAccess } from "./canAccess";
import {
  Action,
  Permission,
  PermissionString,
} from "../constants";

describe("canAccess", () => {
  const permissions: Permission[] = [
    {
      // type: PermissionType.ALLOW,
      action: Action.LIST,
      resource: "product", // same as "product"
      // resourceType: ResourceType.MENU,
    },
    {
      // type: PermissionType.DENY,
      action: [Action.LIST, Action.READ],
      resource: "product",
    },
  ];

  const permissionTable: [
    string,
    {
      expected: boolean;
      permissions: PermissionString | Permission[];
      permission: PermissionString | Permission;
      // testName: string;
    }
  ][] = [
    [
      "should return true with permission [product:get.all]",
      {
        permissions,
        permission: "product:get.all",
        expected: true,
      },
    ],
    [
      "should return true with permission [product:get]",
      {
        permissions,
        permission: "product:get",
        expected: true,
      },
    ],
    [
      "should return true with permission [product.title:get]",
      {
        permissions,
        permission: "product:get",
        expected: true,
      },
    ],
    [
      "should return false with permission [anotherProduct:get]",
      {
        permissions,
        permission: "anotherProduct:get",
        expected: false,
      },
    ],
    [
      "should return true with permission [product:create]",
      {
        // have
        permissions: [
          {
            // type: PermissionType.DENY,
            action: [Action.READ, Action.LIST],
            resource: "learner",
          },
          {
            // type: PermissionType.DENY,
            action: Action.CREATE,
            resource: "product",
          },
        ],

        // want
        permission: {
          action: Action.CREATE,
          resource: "product",
        },

        // canAccess?
        expected: true,
      },
    ],
    [
      "should return true with permission [product:get,get.all]",
      {
        permissions: [
          {
            // type: PermissionType.ALLOW,
            action: Action.ANY,
            resource: "product",
          },
        ],
        permission: "product:get,get.all",
        expected: true,
      },
    ],
    [
      "should return false with permission [product:update]",
      {
        permissions: [
          {
            // type: PermissionType.ALLOW,
            action: Action.ANY,
            resource: "product",
          },
        ],
        permission: "product:update",
        expected: true,
      },
    ],
  ];

  it.each(permissionTable)("%s", (_, { permissions, permission, expected }) => {
    expect(canAccess(permissions)(permission)).toBe(expected);
  });
});
