import { iPayload } from "./jwt.interface";
import { Request } from "express";
import { express } from "express";

declare global {
  namespace Express {
    export interface Request {
      user: iPayload;
    }
  }
}
