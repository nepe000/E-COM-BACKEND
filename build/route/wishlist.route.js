"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const authentication_middleware_1 = require("../middlewaare/authentication.middleware");
const gloabl_types_1 = require("../@types/gloabl.types");
const router = express_1.default.Router();
router.get("/", (0, authentication_middleware_1.Authenticate)(gloabl_types_1.onlyUser), wishlist_controller_1.getByUserId);
router.post("/", (0, authentication_middleware_1.Authenticate)(gloabl_types_1.onlyUser), wishlist_controller_1.create);
router.delete("/", (0, authentication_middleware_1.Authenticate)(gloabl_types_1.onlyUser), wishlist_controller_1.clear);
router.delete("/remove/:productId", (0, authentication_middleware_1.Authenticate)(gloabl_types_1.onlyUser), wishlist_controller_1.removeProductFromWishList);
exports.default = router;
