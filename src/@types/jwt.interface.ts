import mongoose from "mongoose";
import { Role } from "./gloabl.types";

export interface iPayload {
  _id: mongoose.Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}
