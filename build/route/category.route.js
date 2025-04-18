"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import Category from "../models/category.model";
const category_controller_1 = require("../controllers/category.controller");
const authentication_middleware_1 = require("../middlewaare/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
//? Get all categories
router.get("/", category_controller_1.allCat);
//? Create a new category
router.post("/", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), category_controller_1.create);
//? Update a category
router.patch("/:id", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), category_controller_1.updateCat);
//?remove category by id
router.delete("/:id", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyAdmin), category_controller_1.remove);
//?get category by id
router.get("/:id", category_controller_1.getById);
exports.default = router;
