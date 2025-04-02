import { NextFunction, Request, Response } from "express";
import CustomError from "./middleware";
import { Role } from "../@types/gloabl.types";
import { verifyToken } from "../utils/jwt.util";
import { JwtPayload } from "jsonwebtoken";
import User from "../models/model";

export const Authenticate = (roles?: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader: string | undefined = req.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError(
          "Unauthorized , authorization header is missing",
          401
        );
      }

      const access_token = authHeader.split(" ")[1];
      console.log("🚀 ~ return ~ access_token:", access_token);
      if (!access_token) {
        throw new CustomError("Unauthorized access denied", 401);
      }

      const decoded: JwtPayload = verifyToken(access_token);
      console.log("Decoded Token:", decoded);

      if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
        throw new CustomError("Token expired, please login again", 401);
      }

      const user = await User.findById(decoded._id);
      console.log("Fetched User from DB:", user); // Check if the user is fetched correctly
      if (!user) {
        throw new CustomError("User not found , Please register the user", 404);
      }
      if (roles && !roles.includes(user.role)) {
        throw new CustomError(
          `Forbidden: ${user.role} cannot access this resource`,
          403
        );
      }

      req.user = {
        _id: decoded._id,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: user.role,
        email: decoded.email,
      };

      next();
    } catch (err: any) {
      next(new CustomError(err?.message ?? "Something went wrong", 500));
    }
  };
};
