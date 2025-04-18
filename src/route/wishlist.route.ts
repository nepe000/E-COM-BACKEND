import express from "express";
import {
  create,
  getByUserId,
  clear,
  removeProductFromWishList,
} from "../controllers/wishlist.controller";
import { Authenticate } from "../middlewaare/authentication.middleware";
import { onlyUser } from "../@types/global.types";

const router = express.Router();

router.get("/", Authenticate(onlyUser), getByUserId);

router.post("/", Authenticate(onlyUser), create);

router.delete("/", Authenticate(onlyUser), clear);

router.delete(
  "/remove/:productId",
  Authenticate(onlyUser),
  removeProductFromWishList
);

export default router;
