import dedent from "dedent";

/**
 * Collection of Error messages with the error code
 *
 * @protected
 */
export const ErrorMessage = {
  RBAC_CONTEXT_MISUSE: "useRBACContext must be used within a RBACProvider",

  RBAC_INVALID_PERMISSION: (permission: string) => dedent`
    Invalid permission format for "${permission}". 
    Each semicolon separated permission should be in the format:
        "+resource(resourceType):action1,action2,action3; -resource(resourceType):action1,action2,action3; ..."
    Allowed characters for resource, resourceType and actions are:
        \`a-z, A-Z, 0-9, underscore(_), hyphen(-), and period(.)\`
    `,

  RBAC_INVALID_ACTION: (action: string) => dedent`
    Invalid action format for "${action}".
    Action should be in the format:
      "get.all"
      "get"
      "create"
  `,

  RBAC_INVALID_RESOURCE: (resource: string) => dedent`
    Invalid resource format for "${resource}".
    Resource should be in the format:
      "product.*"
      "product.description"
      "product"
  `
};
