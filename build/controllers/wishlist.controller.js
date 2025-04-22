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
exports.clear = exports.getByUserId = exports.removeProductFromWishList = exports.create = void 0;
// import { model } from "mongoose";
const model_1 = __importDefault(require("../models/model"));
const aynchandler_utils_1 = require("../utils/aynchandler.utils");
const middleware_1 = __importDefault(require("../middlewaare/middleware"));
const product_model_1 = __importDefault(require("../models/product.model"));
exports.create = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { productId } = req.body;
    const user = yield model_1.default.findById(userId);
    if (!user) {
        throw new middleware_1.default("User not found", 404);
    }
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        throw new middleware_1.default("product not found", 404);
    }
    const existingProduct = user.wishList.find((list) => list.toString() === productId);
    if (!existingProduct) {
        user.wishList.push(productId);
        yield user.save();
    }
    res.status(201).json({
        status: "success",
        success: true,
        data: user.wishList,
        message: "added to wishlist successfully",
    });
}));
exports.removeProductFromWishList = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const productId = req.params.productId;
    const user = yield model_1.default.findById(userId);
    if (!user) {
        throw new middleware_1.default("User not found", 404);
    }
    const existingProduct = user.wishList.find((list) => list.toString() === productId);
    if (!existingProduct) {
        throw new middleware_1.default("Product does not exist in list", 404);
    }
    user.wishList.pull(productId);
    yield user.save();
    res.status(201).json({
        status: "success",
        success: true,
        data: user.wishList,
        message: "added to wishlist successfully",
    });
}));
exports.getByUserId = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user._id;
    const user = yield model_1.default.findById(id).populate("wishList");
    if (!user) {
        throw new middleware_1.default("User is not there ", 404);
    }
    res.status(202).json({
        status: "success",
        success: true,
        data: user.wishList,
        message: "wishlist is fetched successfully using id",
    });
}));
exports.clear = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user._id;
    const user = yield model_1.default.findById(id).populate("wishList");
    if (!user) {
        throw new middleware_1.default("User is not there ", 404);
    }
    user.wishList = [];
    yield user.save();
    res.status(202).json({
        status: "success",
        success: true,
        data: user.wishList,
        message: "wishlist is fetched successfully using id",
    });
}));
