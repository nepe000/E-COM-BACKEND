import express from "express";
import { Authenticate } from "../middlewaare/authentication.middleware";
import { onlyUser } from "../@types/gloabl.types";
import {
  clearCart,
  create,
  getCartByUserId,
} from "../controllers/cart.controller";
const router = express.Router();

router.post("/add", Authenticate(onlyUser), create);

router.post("/clear", Authenticate(onlyUser), clearCart);

router.get("/:userId", Authenticate(onlyUser), getCartByUserId);

router.delete("/remove/:productId", Authenticate(onlyUser), getCartByUserId);

export default router;
