import express from "express";
import {
  getUsers,
  login,
  register,
  update,
} from "../controllers/user.controller";
import { Authenticate } from "../middlewaare/authentication.middleware";
import { onlyAdmin, onlyUser, allUser } from "../@types/global.types";

const router = express.Router();

//?register user
router.post("/", register);

//?update user
router.put("/:id", Authenticate(allUser), update);

//?login user
router.post("/login", login);

//?get user
router.get("/", Authenticate(allUser), getUsers);

export default router;
