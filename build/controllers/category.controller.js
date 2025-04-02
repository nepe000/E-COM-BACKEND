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
exports.getById = exports.remove = exports.updateCat = exports.allCat = exports.create = void 0;
const aynchandler_utils_1 = require("../utils/aynchandler.utils");
const category_model_1 = __importDefault(require("../models/category.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const middleware_1 = __importDefault(require("../middlewaare/middleware"));
const pagination_utils_1 = require("../utils/pagination.utils");
exports.create = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const category = yield category_model_1.default.create(body);
    res.status(200).json({
        status: "success",
        success: true,
        data: category,
        message: "category for the product is created successfully",
    });
}));
exports.allCat = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, query } = req.query;
    let filter = {};
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
    const queryLimit = parseInt(limit) || 10;
    const currPage = parseInt(page) || 1;
    const skip = (currPage - 1) * queryLimit;
    const category = yield category_model_1.default.find({})
        .skip(skip)
        .limit(queryLimit)
        .sort({ createdAt: -1 });
    const totalCount = yield category_model_1.default.countDocuments();
    const pagination = (0, pagination_utils_1.getPaginationData)(currPage, queryLimit, totalCount);
    res.status(200).json({
        status: "success",
        success: true,
        data: { data: category, pagination },
        message: "All the categories are found",
    });
}));
exports.updateCat = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name, description } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(400).json({
            status: "error",
            success: false,
            message: "Invalid product ID",
        });
        return;
    }
    const updateCat = yield category_model_1.default.findByIdAndUpdate(id, { name, description }, { new: true });
    res.status(200).json({
        status: "success",
        success: true,
        data: updateCat,
        message: "Category updated successfully",
    });
}));
exports.remove = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const category = yield category_model_1.default.findById(id);
    if (!category) {
        throw new middleware_1.default("category not found ", 404);
    }
    yield category_model_1.default.findByIdAndDelete(category._id);
    res.status(200).json({
        status: "success",
        success: true,
        data: category,
        message: "Category deleted successfully",
    });
}));
exports.getById = (0, aynchandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const category = yield category_model_1.default.findById(id);
    if (!category) {
        throw new middleware_1.default("category not found ", 404);
    }
    res.status(200).json({
        status: "success",
        success: true,
        data: category,
        message: "Category fetched successfully",
    });
}));
