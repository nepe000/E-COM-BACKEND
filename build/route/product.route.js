"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gloabl_types_1 = require("../@types/gloabl.types");
const authentication_middleware_1 = require("../middlewaare/authentication.middleware");
const product_controller_1 = require("../controllers/product.controller");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
// Ensure upload directory exists
const uploadDir = "./uploads";
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const router = express_1.default.Router();
// Get all products
router.get("/", product_controller_1.getAll);
// Get a product by ID (Fixed method)
router.get("/:id", product_controller_1.getById);
// Update a product (Fixed to include `/:id`)
router.put("/:id", (0, authentication_middleware_1.Authenticate)(gloabl_types_1.allUser), upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 6 },
]), product_controller_1.updatePro);
// Delete a product
router.delete("/:id", (0, authentication_middleware_1.Authenticate)(gloabl_types_1.onlyAdmin), product_controller_1.deletePro);
// Create a product
router.post("/", (0, authentication_middleware_1.Authenticate)(gloabl_types_1.onlyAdmin), upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 6 },
]), product_controller_1.create);
exports.default = router;
