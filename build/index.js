"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const DB_URL = process.env.DB_URL || "";
const express_1 = __importDefault(require("express"));
// import connectMongodb from "./conn/connection";
const user_route_1 = __importDefault(require("./route/user.route"));
const product_route_1 = __importDefault(require("./route/product.route"));
const connection_1 = require("./connection");
const middleware_1 = __importDefault(require("./middlewaare/middleware"));
const category_route_1 = __importDefault(require("./route/category.route"));
const review_route_1 = __importDefault(require("./route/review.route"));
const cart_route_1 = __importDefault(require("./route/cart.route"));
const wishlist_route_1 = __importDefault(require("./route/wishlist.route"));
const order_routes_1 = __importDefault(require("./route/order.routes"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use("/api/uploads", express_1.default.static(path_1.default.join(__dirname, "../", "uploads")));
// const connectMongodb = require("./conn/connection.js");
//?connection
(0, connection_1.connectMongodb)(DB_URL);
const PORT = process.env.PORT || 8000;
//?using routes
app.use("/api/user", user_route_1.default);
app.use("/api/product", product_route_1.default);
app.use("/api/category", category_route_1.default);
app.use("/api/review", review_route_1.default);
app.use("/api/cart", cart_route_1.default);
app.use("/api/wishlist", wishlist_route_1.default);
app.use("/api/order", order_routes_1.default);
app.use("/", (req, res) => {
    res.status(200).json({ message: "Server is up and running" });
});
//?handle not found
app.all("*", (req, res, next) => {
    const message = `cannot ${req.method} on ${req.originalUrl}`;
    const error = new middleware_1.default(message, 404);
    next(error);
});
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || "error";
    const message = error.message || "Something went wrong";
    res.status(statusCode).json({
        status,
        success: false,
        message,
    });
});
app.listen(PORT, () => console.log(`server is running onn http://localhost:${PORT}`));
