import mongoose from "mongoose";
import { Role } from "../@types/global.types";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      max: [50, "First Name cannot exceed 50 characters"],
      min: [3, "First Name should be at least 3 characters"],
    },
    lastName: {
      type: String,
      required: true,
      max: [50, "First Name cannot exceed 50 characters"],
      min: [3, "First Name should be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [emailRegex, "Please enter a valid email format"],
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.user,
    },
    phoneNumber: {
      type: String,
      required: false,
      min: [10, "Phone number should not exceed 10 digits"],
    },
    password: {
      type: String,
      required: true,
      min: [6, "Minimum 6 letter must be in your password"],
    },
    gender: {
      type: String,
      required: false,
    },
    wishList: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "product",
        },
      },
    ],
  },
  { timestamps: true }
);
const User = mongoose.model("user", userSchema);

export default User;
