import express from "express";
import { Authenticate } from "../middlewaare/authentication.middleware";
import {
  allRev,
  createRev,
  remove,
  updateRev,
} from "../controllers/review.controller";
import { allUser, onlyAdmin, onlyUser } from "../@types/gloabl.types";
// import { get } from "mongoose";

const router = express.Router();

router.post("/", Authenticate(onlyUser), createRev);

router.get("/", allRev);

router.patch("/:id", Authenticate(onlyUser), updateRev);

router.delete("/:id", Authenticate(allUser), remove);

export default router;
