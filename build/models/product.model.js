"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Product name ios required"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Price is needed"],
        min: [0, "Price should be greater than zero"],
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "user",
        required: true,
    },
    category: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "category",
        required: true,
    },
    description: {
        type: String,
        required: false,
        min: [50, "description should be at least 50 characters long"],
        trim: true,
    },
    coverImage: {
        type: String,
        required: false,
    },
    images: [
        {
            type: String,
            required: false,
        },
    ],
    reviews: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "review",
            required: true,
            default: [],
        },
    ],
    avgRating: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
const Product = mongoose_1.default.model("product", productSchema);
exports.default = Product;
