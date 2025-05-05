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
exports.getById = exports.deletePro = exports.updatePro = exports.getAll = exports.create = void 0;
const aynchandler_utils_1 = require("../utils/aynchandler.utils");
const product_model_1 = __importDefault(require("../models/product.model"));
const middleware_1 = __importDefault(require("../middlewaare/middleware"));
const deleteFile_util_1 = require("../utils/deleteFile.util");
const category_model_1 = __importDefault(require("../models/category.model"));
const pagination_utils_1 = require("../utils/pagination.utils");
exports.create = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, description, category: categoryId } = req.body;
    const admin = req.user;
    const files = req.files;
    if (!files || !files.coverImage) {
        throw new middleware_1.default("cover image is required", 400);
    }
    const coverImage = files.coverImage;
    const images = files.images;
    // get category
    const category = yield category_model_1.default.findById(categoryId);
    if (!category) {
        throw new middleware_1.default("category not found", 404);
    }
    const product = new product_model_1.default({
        name,
        price,
        description,
        createdBy: admin._id,
        category: category._id,
    });
    product.coverImage = {
        path: coverImage[0].path,
        public_id: coverImage[0].fieldname,
    };
    if (images && images.length > 0) {
        const imagePaths = images.map((image, index) => ({
            path: image.path,
            public_id: image.fieldname,
        }));
        product.images = imagePaths;
    }
    yield product.save();
    // console.log(req.file);
    res.status(200).json({
        status: "success",
        success: true,
        data: product,
        message: "Product created successfully",
    });
}));
exports.getAll = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, query, category, minPrice, maxPrice } = req.query;
    const queryLimit = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * queryLimit;
    let filter = {};
    if (category) {
        filter.category = category;
    }
    if (minPrice && maxPrice) {
        filter.price = {
            $lte: parseFloat(maxPrice),
            $gte: parseFloat(minPrice),
        };
    }
    if (query) {
        filter.$or = [
            {
                name: { $regex: query, $options: "i" },
            },
            {
                description: { $regex: query, $options: "i" },
            },
        ];
    }
    const products = yield product_model_1.default.find(filter)
        .skip(skip)
        .limit(queryLimit)
        .populate("createdBy")
        .sort({ createdAt: -1 })
        .populate("category");
    const totalCount = yield product_model_1.default.countDocuments(filter);
    const pagination = (0, pagination_utils_1.getPaginationData)(currentPage, queryLimit, totalCount);
    res.status(200).json({
        success: true,
        status: "success",
        data: {
            data: products,
            pagination,
        },
        message: "Products fetched successfully",
    });
}));
exports.updatePro = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { deletedImages, name, description, price, category } = req.body;
    const id = req.params.id;
    const { coverImage, images } = req.files;
    // Validate category first
    const categoryExists = yield category_model_1.default.findById(category);
    if (!categoryExists) {
        throw new middleware_1.default("Category not found", 404);
    }
    // Find and update the product
    const updatedProduct = yield product_model_1.default.findByIdAndUpdate(id, { name, description, price, category }, { new: true });
    if (!updatedProduct) {
        throw new middleware_1.default("Product not found", 400);
    }
    // Delete cover image if provided
    if (coverImage) {
        yield (0, deleteFile_util_1.deleteFiles)([updatedProduct.coverImage]);
        updatedProduct.coverImage = {
            path: coverImage[0].path,
            public_id: coverImage[0].fieldname,
        };
    }
    // Delete selected images
    if (deletedImages && deletedImages.length > 0) {
        yield (0, deleteFile_util_1.deleteFiles)(deletedImages);
        updatedProduct.images = (updatedProduct.images || []).filter((image) => !deletedImages.includes(image.public_id));
    }
    // Add new images if provided
    if (images && images.length > 0) {
        const imagePath = images.map((image) => {
            return {
                path: image.path,
                public_id: image.filename,
            };
        });
        updatedProduct.images = [...(updatedProduct.images || []), ...imagePath];
    }
    yield updatedProduct.save();
    res.status(200).json({
        status: "success",
        success: true,
        data: updatedProduct,
        message: "Product updated successfully",
    });
}));
exports.deletePro = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new middleware_1.default("Product is not here", 404);
    }
    if (product.coverImage && product.coverImage.length > 0) {
        const coverImageIds = product.coverImage.map((img) => img.public_id);
        yield (0, deleteFile_util_1.deleteFiles)(coverImageIds);
    }
    // Handle product images
    if (product.images && product.images.length > 0) {
        const imageIds = product.images.map((img) => img.public_id);
        yield (0, deleteFile_util_1.deleteFiles)(imageIds);
    }
    yield product_model_1.default.findByIdAndDelete(id);
    res.status(200).json({
        status: "success",
        success: true,
        data: product,
        message: "Product deleted successfully",
    });
}));
exports.getById = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const product = yield product_model_1.default.findById(id).populate("createdBy");
    res.status(200).json({
        success: true,
        status: "success",
        data: product,
        message: "product fetched successfully",
    });
}));
