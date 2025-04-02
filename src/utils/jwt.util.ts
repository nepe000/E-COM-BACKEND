import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { iPayload } from "../@types/jwt.interface";

const JWT_SECRET = process.env.JWT_SECRET || "";
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || "1d";

export const generateToken = (payload: iPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
