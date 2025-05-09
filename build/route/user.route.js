"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const authentication_middleware_1 = require("../middlewaare/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
//?register user
router.post("/", user_controller_1.register);
//?update user
router.put("/:id", (0, authentication_middleware_1.Authenticate)(global_types_1.allUser), user_controller_1.update);
//?login user
router.post("/login", user_controller_1.login);
router.post("/admin/login", user_controller_1.adminLogin);
//?get user
router.get("/", user_controller_1.getUsers);
exports.default = router;
