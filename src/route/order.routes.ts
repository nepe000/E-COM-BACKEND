import express from "express";
import {
  getAllOrder,
  getOrderByUserId,
  placeOrder,
  updateOrderStatus,
} from "../controllers/order.controller";
import { Authenticate } from "../middlewaare/authentication.middleware";
import { onlyUser } from "../@types/global.types";
const router = express.Router();

//?create an order
router.post("/", Authenticate(onlyUser), placeOrder);

//?get all order
router.get("/", getAllOrder);

//?get order using userid
router.get("/:userId", getOrderByUserId);

//?update order using orderId

router.patch("/:orderId", updateOrderStatus);

export default router;
