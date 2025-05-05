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
const express_1 = __importDefault(require("express"));
const global_types_1 = require("../@types/global.types");
const authentication_middleware_1 = require("../middlewaare/authentication.middleware");
const product_controller_1 = require("../controllers/product.controller");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = require("../config/cloudinary.config");
const router = express_1.default.Router();
// Ensure upload directory exists
const uploadDir = "./uploads";
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.cloudinary,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        return {
            folder: "ecom/products",
            allowed_formats: ["jpeg", "webp", "jpg", "png", "svg"],
        };
    }),
});
const upload = (0, multer_1.default)({ storage: storage });
// Get all products
router.get("/", product_controller_1.getAll);
// Get a product by ID (Fixed method)
router.get("/:id", product_controller_1.getById);
// Update a product (Fixed to include `/:id`)
router.put("/:id", (0, authentication_middleware_1.Authenticate)(global_types_1.allUser), upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 6 },
]), product_controller_1.updatePro);
// Delete a product
router.delete("/:id", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyAdmin), product_controller_1.deletePro);
// Create a product
router.post("/", (0, authentication_middleware_1.Authenticate)(global_types_1.allUser), upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 6 },
]), product_controller_1.create);
exports.default = router;
