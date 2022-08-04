import { parsePermission } from "./parsePermission";
import { ERR_INVALID_PERMISSION } from "../constants/errors";
import { PermissionType } from "../constants";

describe("Permission Parser", function () {
  it("should parse permission string with default permission type", function () {
    const permission = "product:get.all";
    const expected = [
      {
        type: PermissionType.ALLOW,
        resource: "product",
        action: ["get.all"],
      },
    ];
    expect(parsePermission(permission)).toMatchObject(expected);
  });

  it("should parse permission string", function () {
    const permission = "+ resource: action1, action2";
    const expected = [
      {
        type: PermissionType.ALLOW,
        resource: "resource",
        resourceType: undefined,
        action: ["action1", "action2"],
      },
    ];
    expect(parsePermission(permission)).toMatchObject(expected);
  });

  it("should parse permission string with resourceType", function () {
    const permission = "+ resource(resourceType): action1, action2";
    const expected = [
      {
        type: PermissionType.ALLOW,
        resource: "resource",
        resourceType: "resourceType",
        action: ["action1", "action2"],
      },
    ];
    expect(parsePermission(permission)).toMatchObject(expected);
  });

  it("should parse permission string with DENY type", function () {
    const permission = "- resource: action1, action2";
    const expected = [
      {
        type: PermissionType.DENY,
        resource: "resource",
        resourceType: undefined,
        action: ["action1", "action2"],
      },
    ];
    expect(parsePermission(permission)).toMatchObject(expected);
  });

  it("should parse permission string with DENY type and resourceType", function () {
    const permission = "- resource(resourceType): action1, action2";
    const expected = [
      {
        type: PermissionType.DENY,
        resource: "resource",
        resourceType: "resourceType",
        action: ["action1", "action2"],
      },
    ];
    expect(parsePermission(permission)).toMatchObject(expected);
  });

  it("should throw error when permission string is invalid", function () {
    const permission = "+ resource";
    expect(() => parsePermission(permission)).toThrowError(
      ERR_INVALID_PERMISSION(permission)
    );
  });
});
