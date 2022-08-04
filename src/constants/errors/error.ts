/**
 * Base class which RBAC errors inherit from.
 *
 * @protected
 */
export class RBACError extends Error {
  constructor(message: string, public code: string, public statusCode: number) {
    super(message);
  }
}
