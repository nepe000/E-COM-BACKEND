"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticate = void 0;
const middleware_1 = __importDefault(require("./middleware"));
const jwt_util_1 = require("../utils/jwt.util");
const model_1 = __importDefault(require("../models/model"));
const Authenticate = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const authHeader = Array.isArray(req.headers["authorization"])
                ? req.headers["authorization"][0]
                : req.headers["authorization"];
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new middleware_1.default("User isnt logged in , Login First", 401);
            }
            const access_token = authHeader.split(" ")[1];
            if (!access_token) {
                throw new middleware_1.default("Unauthorized access denied", 401);
            }
            const decoded = (0, jwt_util_1.verifyToken)(access_token);
            if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
                throw new middleware_1.default("Token expired, please login again", 401);
            }
            const user = yield model_1.default.findById(decoded._id);
            if (!user) {
                throw new middleware_1.default("User not found, Please register the user", 404);
            }
            if (roles && !roles.includes(user.role)) {
                throw new middleware_1.default(`Forbidden: ${user.role} cannot access this resource`, 403);
            }
            req.user = {
                _id: decoded._id,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                role: user.role,
                email: decoded.email,
            };
            next();
        }
        catch (err) {
            next(new middleware_1.default((_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : "Something went wrong", 500));
        }
    });
};
exports.Authenticate = Authenticate;
