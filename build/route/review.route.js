"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_middleware_1 = require("../middlewaare/authentication.middleware");
const review_controller_1 = require("../controllers/review.controller");
const global_types_1 = require("../@types/global.types");
// import { get } from "mongoose";
const router = express_1.default.Router();
router.post("/", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), review_controller_1.createRev);
router.get("/", review_controller_1.allRev);
router.patch("/:id", (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), review_controller_1.updateRev);
router.delete("/:id", (0, authentication_middleware_1.Authenticate)(global_types_1.allUser), review_controller_1.remove);
exports.default = router;
