"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const global_types_1 = require("../@types/global.types");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const userSchema = new mongoose_1.default.Schema({
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
        enum: Object.values(global_types_1.Role),
        default: global_types_1.Role.USER,
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: true,
            ref: "product",
        },
    ],
}, { timestamps: true });
const User = mongoose_1.default.model("user", userSchema);
exports.default = User;
