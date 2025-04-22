import { NextFunction, Request, Response } from "express";
import CustomError from "./middleware";
import { Role } from "../@types/global.types";
import { verifyToken } from "../utils/jwt.util";
import { JwtPayload } from "jsonwebtoken";
import User from "../models/model";

export const Authenticate = (roles?: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader: string | undefined = Array.isArray(
        req.headers["authorization"]
      )
        ? req.headers["authorization"][0]
        : req.headers["authorization"];

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError("User isnt logged in , Login First", 401);
      }

      const access_token = authHeader.split(" ")[1];
      if (!access_token) {
        throw new CustomError("Unauthorized access denied", 401);
      }

      const decoded: JwtPayload = verifyToken(access_token);
      if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
        throw new CustomError("Token expired, please login again", 401);
      }

      const user = await User.findById(decoded._id);
      if (!user) {
        throw new CustomError("User not found, Please register the user", 404);
      }

      if (roles && !roles.includes(user.role as Role)) {
        throw new CustomError(
          `Forbidden: ${user.role} cannot access this resource`,
          403
        );
      }

      req.user = {
        _id: decoded._id,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: user.role as Role,
        email: decoded.email,
      };

      next();
    } catch (err: any) {
      next(new CustomError(err?.message ?? "Something went wrong", 500));
    }
  };
};
