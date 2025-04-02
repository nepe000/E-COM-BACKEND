import express from "express";
import {
  getUsers,
  login,
  register,
  update,
} from "../controllers/user.controller";
import { Authenticate } from "../middlewaare/authentication.middleware";
import { onlyAdmin, onlyUser } from "../@types/gloabl.types";

const router = express.Router();

//?register user
router.post("/", register);

//?update user
router.put("/:id", Authenticate(onlyUser), update);

//?login user
router.post("/login", login);

//?get user
router.get("/", Authenticate(onlyUser), getUsers);

export default router;
