"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const authentication_middleware_1 = require("../middlewaare/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
//?create an order
router.post("/", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), order_controller_1.placeOrder);
//?get all order
router.get("/", order_controller_1.getAllOrder);
//?get order using userid
router.get("/:userId", order_controller_1.getOrderByUserId);
//?update order using orderId
router.patch("/:orderId", order_controller_1.updateOrderStatus);
exports.default = router;
