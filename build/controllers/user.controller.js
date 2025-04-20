"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.login = exports.update = exports.register = void 0;
const model_1 = __importDefault(require("../models/model"));
const jwt_util_1 = require("../utils/jwt.util");
const bcrypt_util_1 = require("../utils/bcrypt.util");
const aynchandler_utils_1 = require("../utils/aynchandler.utils");
const middleware_1 = __importDefault(require("../middlewaare/middleware"));
const global_types_1 = require("../@types/global.types");
const pagination_utils_1 = require("../utils/pagination.utils");
// import { compare } from "bcryptjs";
exports.register = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (!body.password) {
        throw new middleware_1.default("Password is required", 400);
    }
    const hashedPassword = yield (0, bcrypt_util_1.hash)(body.password);
    body.password = hashedPassword;
    const user = yield model_1.default.create(body);
    const payload = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
    };
    const token = (0, jwt_util_1.generateToken)(payload);
    res.status(201).json({
        status: "success",
        success: true,
        message: "User registered successfully",
        data: user,
        token,
    });
}));
exports.update = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { firstName, lastName, gender, phoneNumber } = req.body;
    const check = yield model_1.default.findByIdAndUpdate(id, { firstName, lastName, gender, phoneNumber }, { new: true });
    if (!check) {
        // res.status(500).json({
        //   status: "failed",
        //   success: false,
        //   message: "User is not there",
        // });
        throw new middleware_1.default("User is not there", 400);
    }
    res.status(201).json({
        status: "success",
        success: true,
        message: "user registered successfully",
    });
}));
//? export const login = (req,res) =>{} 1.email pass 2.user.findone({email:email}) 3.if(!user) 4.user.pass===body.pass 5.if(!pass)=>error throw
//? 6. res.success =>login successful
exports.login = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email) {
        throw new middleware_1.default("Email is required", 400);
    }
    if (!password) {
        throw new middleware_1.default("Password is required", 400);
    }
    const user = yield model_1.default.findOne({ email: email });
    if (!user) {
        throw new middleware_1.default("User not found, please register", 404);
    }
    const isMatch = yield (0, bcrypt_util_1.compare)(password, user.password);
    if (!isMatch) {
        throw new middleware_1.default("Incorrect password", 400);
    }
    const payload = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
    };
    const token = (0, jwt_util_1.generateToken)(payload);
    res
        .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    })
        .status(200)
        .json({
        status: "success",
        success: true,
        message: "Login success",
        user,
        token,
    });
}));
exports.getUsers = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.user);
    const id = req.user._id;
    const { sortBy, order } = req.query;
    let filter = {};
    const { limit, page, query } = req.query;
    const perPage = parseInt(limit);
    const currentPage = parseInt(page);
    const skip = (currentPage - 1) * perPage;
    if (query) {
        filter.$or = [
            {
                firstName: { $regex: query, $options: "i" },
            },
            {
                lastName: { $regex: query, $options: "i" },
            },
            {
                email: { $regex: query, $options: "i" },
            },
            {
                phoneNo: { $regex: query, $options: "i" },
            },
        ];
    }
    filter.role = global_types_1.Role.USER;
    let sortOptions = { createdAt: -1 }; // newest user sort
    if (sortBy &&
        ["createdAt", "lastLogin", "updatedAt"].includes(sortBy)) {
        sortOptions = { [sortBy]: order === "asc" ? 1 : -1 };
    }
    const users = yield model_1.default.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .exec();
    const totalCount = yield model_1.default.countDocuments(filter);
    const allUsers = yield model_1.default.find({ _id: id });
    res.status(201).json({
        status: "success",
        success: true,
        message: "user registered successfully",
        data: {
            allUsers,
            data: users,
            pagination: (0, pagination_utils_1.getPaginationData)(currentPage, perPage, totalCount),
        },
    });
}));
