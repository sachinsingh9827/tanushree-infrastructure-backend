import { failure } from "../utils/apiResponse.js";

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.admin || !allowedRoles.includes(req.admin.role)) {
      return failure(res, "You do not have permission to perform this action", [], 403);
    }
    next();
  };
}
