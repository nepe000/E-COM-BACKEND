"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_middleware_1 = require("../middlewaare/authentication.middleware");
const gloabl_types_1 = require("../@types/gloabl.types");
const cart_controller_1 = require("../controllers/cart.controller");
const router = express_1.default.Router();
router.post("/add", (0, authentication_middleware_1.Authenticate)(gloabl_types_1.onlyUser), cart_controller_1.create);
router.post("/clear", (0, authentication_middleware_1.Authenticate)(gloabl_types_1.onlyUser), cart_controller_1.clearCart);
router.get("/:userId", (0, authentication_middleware_1.Authenticate)(gloabl_types_1.onlyUser), cart_controller_1.getCartByUserId);
router.delete("/remove/:productId", (0, authentication_middleware_1.Authenticate)(gloabl_types_1.onlyUser), cart_controller_1.getCartByUserId);
exports.default = router;
