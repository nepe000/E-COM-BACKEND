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
exports.getReviewByIdProductId = exports.remove = exports.updateRev = exports.allRev = exports.createRev = void 0;
const aynchandler_utils_1 = require("../utils/aynchandler.utils");
const review_model_1 = __importDefault(require("../models/review.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const middleware_1 = __importDefault(require("../middlewaare/middleware"));
const pagination_utils_1 = require("../utils/pagination.utils");
exports.createRev = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = req.body;
    const user = req.user;
    const { productId, rating } = body;
    if (!productId) {
        throw new middleware_1.default(" product id are required", 400);
    }
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        throw new middleware_1.default("product not found", 404);
    }
    const reviews = (_a = product.reviews) !== null && _a !== void 0 ? _a : [];
    const newReview = yield review_model_1.default.create(Object.assign(Object.assign({}, body), { product: productId, user: user }));
    reviews === null || reviews === void 0 ? void 0 : reviews.push(newReview._id);
    const totalRating = (product === null || product === void 0 ? void 0 : product.avgRating) * reviews.length - 1 + Number(rating);
    product.avgRating = totalRating / reviews.length;
    yield product.save();
    res.status(200).json({
        status: "success",
        success: true,
        data: newReview,
        message: "Reviews for the product is created successfully",
    });
}));
exports.allRev = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page } = req.query;
    const perPage = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * perPage;
    const { rating } = req.query;
    const filteredRating = Number(rating);
    const filter = {};
    if (!isNaN(filteredRating) && filteredRating >= 1 && filteredRating <= 5) {
        filter.rating = filteredRating;
    }
    const review = yield review_model_1.default.find(filter)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .populate("user")
        .populate("product");
    const totalCount = yield review_model_1.default.countDocuments();
    res.status(200).json({
        status: "success",
        success: true,
        data: {
            data: review,
            pagination: (0, pagination_utils_1.getPaginationData)(currentPage, perPage, totalCount),
        },
        message: "All the Reviews are found",
    });
}));
exports.updateRev = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rating, review } = req.body;
    console.log(typeof rating);
    if (typeof Number(rating) !== "number") {
        throw new middleware_1.default("Review must be number type", 400);
    }
    const id = req.params.id;
    const existingReview = yield review_model_1.default.findById(id);
    if (!existingReview) {
        throw new middleware_1.default("Review not found", 404);
    }
    const product = yield product_model_1.default.findById(existingReview.product);
    if (!product) {
        throw new middleware_1.default("Product not found", 404);
    }
    const newRating = Number(product === null || product === void 0 ? void 0 : product.avgRating) * (product === null || product === void 0 ? void 0 : product.reviews.length) -
        existingReview.rating +
        Number(rating);
    product.avgRating = newRating / product.reviews.length;
    yield (product === null || product === void 0 ? void 0 : product.save());
    const updatedRev = yield review_model_1.default.findByIdAndUpdate(id, { rating, review }, { new: true });
    res.status(200).json({
        status: "success",
        success: true,
        data: updatedRev,
        message: "Review updated successfully",
    });
}));
exports.remove = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const review = yield review_model_1.default.findById(id).populate("");
    if (!review) {
        throw new middleware_1.default("Review not found", 404);
    }
    const product = yield product_model_1.default.findById(review.product);
    if (!product) {
        throw new middleware_1.default("Product not found", 404);
    }
    product === null || product === void 0 ? void 0 : product.reviews.pull(review._id);
    if ((product === null || product === void 0 ? void 0 : product.reviews.length) === 0) {
        product.avgRating = 0;
    }
    else {
        product.avgRating =
            Number(product.avgRating) * ((product === null || product === void 0 ? void 0 : product.reviews.length) + 1) -
                review.rating / (product === null || product === void 0 ? void 0 : product.reviews.length);
    }
    yield review_model_1.default.findByIdAndDelete(review._id);
    yield (product === null || product === void 0 ? void 0 : product.save());
    res.status(200).json({
        status: "success",
        success: true,
        data: product,
        message: "Review updated successfully",
    });
}));
exports.getReviewByIdProductId = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const reviews = yield review_model_1.default.find({ product: productId }).populate("user");
    res.status(200).json({
        success: true,
        status: "success",
        data: reviews,
    });
}));
