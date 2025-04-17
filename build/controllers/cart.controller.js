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
exports.removeItemFromCart = exports.clearCart = exports.getCartByUserId = exports.create = void 0;
const aynchandler_utils_1 = require("../utils/aynchandler.utils");
const middleware_1 = __importDefault(require("../middlewaare/middleware"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
exports.create = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    let cart;
    if (!productId) {
        throw new middleware_1.default("Product ID is required", 404);
    }
    cart = yield cart_model_1.default.findOne({ product: productId });
    if (!cart) {
        cart = new cart_model_1.default({ product: productId, items: [] });
    }
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        throw new middleware_1.default("Product not found", 404);
    }
    const existingProduct = cart.items.filter((item) => item.product.toString() === productId);
    if (existingProduct && existingProduct.length > 0) {
        existingProduct[0].quantity += quantity;
        cart.items.push(existingProduct);
    }
    else {
        cart.items.push({ product: productId, quantity });
    }
    cart.items.push({ product: productId, quantity });
    yield (cart === null || cart === void 0 ? void 0 : cart.save());
    res.status(201).json({
        status: "success",
        success: true,
        message: "Product added to cart ",
    });
}));
exports.getCartByUserId = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const cart = yield cart_model_1.default.findOne({ user: userId });
    res.status(200).json({
        status: "success",
        success: true,
        message: "Cart fetched successfully",
        data: cart,
    });
}));
exports.clearCart = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const cart = yield cart_model_1.default.findOne({ user: userId });
    if (!cart) {
        throw new middleware_1.default("Cart is not created yet", 400);
    }
    yield cart_model_1.default.findOneAndDelete({ user: userId });
    res.status(200).json({
        status: "success",
        success: true,
        message: "Cart cleared successfully",
        data: null,
    });
}));
exports.removeItemFromCart = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    const userId = req.user._id;
    if (!productId) {
        throw new middleware_1.default("ProductId is required", 400);
    }
    const cart = yield cart_model_1.default.findOne({ user: userId });
    if (!cart) {
        throw new middleware_1.default("Cart is not created yet", 400);
    }
    // const  = cart.items.filter(
    //   (item) => item.product.toString()! === productId
    // );
    cart.items.pull({ product: productId });
    const updatedCart = yield cart.save();
    res.status(200).json({
        status: "success",
        success: true,
        message: "cart cleared successfully",
        data: updatedCart,
    });
}));
