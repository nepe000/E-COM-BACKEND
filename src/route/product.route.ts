import express from "express";
import { allUser, onlyAdmin } from "../@types/global.types";
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
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.config";

const router = express.Router();
// Ensure upload directory exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "ecom/products",
      allowed_formats: ["jpeg", "webp", "jpg", "png", "svg"],
    };
  },
});

const upload = multer({ storage: storage });

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
  Authenticate(allUser),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 6 },
  ]),
  create
);

export default router;
