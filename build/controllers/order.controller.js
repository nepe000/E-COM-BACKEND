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
exports.deleteOrder = exports.updateOrderStatus = exports.getOrderByUserId = exports.getAllOrder = exports.placeOrder = void 0;
const aynchandler_utils_1 = require("../utils/aynchandler.utils");
const cart_model_1 = __importDefault(require("../models/cart.model"));
const middleware_1 = __importDefault(require("../middlewaare/middleware"));
const product_model_1 = __importDefault(require("../models/product.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const orderconfirmation_1 = require("../utils/orderconfirmation");
const pagination_utils_1 = require("../utils/pagination.utils");
exports.placeOrder = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const cart = yield cart_model_1.default.findOne({ user: userId });
    if (!cart) {
        throw new middleware_1.default("Cart not found", 404);
    }
    const products = yield Promise.all(cart.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const Product = yield product_model_1.default.findById(item.product);
        if (!Product) {
            throw new middleware_1.default("Product not found", 404);
        }
        return {
            product: Product._id,
            quantity: item.quantity,
            totalPrice: Number(Product.price) * item.quantity,
        };
    })));
    const totalAmount = products.reduce((acc, item) => acc + item.totalPrice, 0);
    const Order = new order_model_1.default({
        user: userId,
        items: products,
        totalAmount,
    });
    const newOrder = yield Order.save();
    const populatedOrder = yield order_model_1.default
        .findById(newOrder._id)
        .populate("items.product");
    if (!populatedOrder) {
        throw new middleware_1.default("order not created", 404);
    }
    yield (0, orderconfirmation_1.sendOrderConfirmationEmail)({
        to: req.user.email,
        orderDetails: populatedOrder,
    });
    yield cart_model_1.default.findByIdAndDelete(cart._id);
    res.status(201).json({
        status: "Success",
        success: true,
        data: newOrder,
        message: "Order placed successfully!",
    });
}));
//?Get all order
exports.getAllOrder = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, status, query, minTotal, maxTotal, toDate, fromDate } = req.query;
    let filter = {};
    if (status) {
        filter.orderId = { $regex: query, $options: "i" };
    }
    //date filter
    if (toDate || fromDate) {
        if (toDate || fromDate)
            if (minTotal && maxTotal) {
                filter.createdAt = {
                    $lte: new Date(toDate),
                    $gte: new Date(fromDate),
                };
            }
        if (fromDate) {
            filter.createdAt = { $gte: new Date(fromDate) };
        }
        if (toDate) {
            filter.createdAt = { $lte: new Date(toDate) };
        }
    }
    if (minTotal || maxTotal)
        if (minTotal && maxTotal) {
            filter.totalAmount = {
                $lte: parseFloat(maxTotal),
                $gte: parseFloat(minTotal),
            };
        }
    if (minTotal) {
        filter.totalAmount = { $lte: parseFloat(maxTotal) };
    }
    if (maxTotal) {
        filter.totalAmount = { $gte: parseFloat(minTotal) };
    }
    const currentPage = parseInt(page) || 10;
    const perPage = parseInt(limit) || 1;
    const skip = (currentPage - 1) * perPage;
    if (query) {
        filter.orderId = { $regex: query, $options: "i" };
    }
    const allOrder = yield order_model_1.default
        .find(filter)
        .skip(skip)
        .sort({ createdAt: -1 })
        .populate("items.product")
        .populate("user");
    const totalCount = yield order_model_1.default.countDocuments(filter);
    res.status(201).json({
        success: true,
        status: "Success",
        data: {
            data: allOrder,
            pagination: (0, pagination_utils_1.getPaginationData)(currentPage, perPage, totalCount),
        },
        message: "Order fetched successfully!",
    });
}));
//?Get by userID
exports.getOrderByUserId = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const Order = yield order_model_1.default
        .findOne({ user: userId })
        .populate("items.product")
        .populate("user", "-password");
    res.status(201).json({
        success: true,
        status: "Success",
        data: Order,
        message: "Order fetched successfully!",
    });
}));
//? Update Order  status
exports.updateOrderStatus = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) {
        throw new middleware_1.default("status is required", 404);
    }
    if (!orderId) {
        throw new middleware_1.default("orderId is required", 404);
    }
    const updateOrder = yield order_model_1.default.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updateOrder) {
        throw new middleware_1.default("updateOrder is required", 404);
    }
    res.status(200).json({
        success: true,
        status: "Success",
        data: updateOrder,
        message: "Order status updated successfully!",
    });
}));
//?Delete Order
exports.deleteOrder = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    if (!orderId) {
        throw new middleware_1.default("orderId is required", 404);
    }
    const deleteOrder = yield order_model_1.default.findByIdAndDelete(orderId);
    if (!deleteOrder) {
        throw new middleware_1.default("updateOrder is required", 404);
    }
    res.status(200).json({
        success: true,
        status: "Success",
        data: deleteOrder,
        message: "Order deleted successfully!",
    });
}));
//?Cancel order status
