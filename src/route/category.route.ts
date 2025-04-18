import express from "express";
// import Category from "../models/category.model";
import {
  allCat,
  create,
  getById,
  remove,
  updateCat,
} from "../controllers/category.controller";
import { Authenticate } from "../middlewaare/authentication.middleware";
import { onlyAdmin, onlyUser } from "../@types/global.types";

const router = express.Router();

//? Get all categories
router.get("/", allCat);

//? Create a new category
router.post("/", Authenticate(onlyUser), create);

//? Update a category
router.patch("/:id", Authenticate(onlyUser), updateCat);

//?remove category by id
router.delete("/:id", Authenticate(onlyAdmin), remove);

//?get category by id
router.get("/:id", getById);

export default router;
