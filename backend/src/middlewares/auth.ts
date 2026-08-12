import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { Role, verifyToken } from "../utils/jwt";
import { sendResponse } from "../utils/sendResponse";

const VALID_ROLES: Role[] = ["ADMIN", "USER"];

export const auth =
  (...allowedRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        return sendResponse(res, {
          statusCode: status.UNAUTHORIZED,
          success: false,
          message: "Access token is required",
        });
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);

      if (!VALID_ROLES.includes(decoded.role)) {
        return sendResponse(res, {
          statusCode: status.FORBIDDEN,
          success: false,
          message: "Invalid user role",
        });
      }

      const rolesToCheck = allowedRoles.length > 0 ? allowedRoles : VALID_ROLES;

      if (!rolesToCheck.includes(decoded.role)) {
        return sendResponse(res, {
          statusCode: status.FORBIDDEN,
          success: false,
          message: "You are not authorized to access this resource",
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
