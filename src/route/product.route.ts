import express from "express";
import { allUser, onlyAdmin } from "../@types/gloabl.types";
import { Authenticate } from "../middlewaare/authentication.middleware";
import {
  create,
  deletePro,
  getAll,
  getById,
  updatePro,
} from "../controllers/product.controller";
import multer from "multer";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

// Get all products
router.get("/", getAll);

// Get a product by ID (Fixed method)
router.get("/:id", getById);

// Update a product (Fixed to include `/:id`)
router.put(
  "/:id",
  Authenticate(allUser),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 6 },
  ]),
  updatePro
);

// Delete a product
router.delete("/:id", Authenticate(onlyAdmin), deletePro);

// Create a product
router.post(
  "/",
  Authenticate(onlyAdmin),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 6 },
  ]),
  create
);

export default router;
