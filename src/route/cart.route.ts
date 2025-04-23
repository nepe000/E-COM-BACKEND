import express from "express";
import { Authenticate } from "../middlewaare/authentication.middleware";
import { onlyUser } from "../@types/global.types";
import {
  clearCart,
  create,
  getCartByUserId,
  removeItemFromCart,
} from "../controllers/cart.controller";
const router = express.Router();

router.post("/add", Authenticate(onlyUser), create);

router.post("/clear", Authenticate(onlyUser), clearCart);

router.get("/", Authenticate(onlyUser), getCartByUserId);

router.delete("/remove/:productId", Authenticate(onlyUser), removeItemFromCart);

export default router;
