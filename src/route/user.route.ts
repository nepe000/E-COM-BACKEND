import express from "express";
import {
  adminLogin,
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
router.post("/user/admin/login", adminLogin);

//?get user
router.get("/", getUsers);

export default router;
