"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: 1,
        max: 5,
    },
    review: {
        type: String,
        required: [true, "Review is required"],
        trim: true,
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        required: [true, "User is required"],
        ref: "user",
    },
    product: {
        type: mongoose_1.default.Types.ObjectId,
        required: [true, "Product is required"],
        ref: "Product",
    },
}, { timestamps: true });
const Review = mongoose_1.default.model("Review", reviewSchema);
exports.default = Review;
