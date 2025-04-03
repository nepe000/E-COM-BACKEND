import "dotenv/config";
const DB_URL = process.env.DB_URL || "";
import express, { Request, NextFunction, Response } from "express";
// import connectMongodb from "./conn/connection";
import userRoutes from "./route/user.route";
import productRoutes from "./route/product.route";
import { connectMongodb } from "./connection";
import CustomError from "./middlewaare/middleware";
import categoryRoutes from "./route/category.route";
import reviewRoutes from "./route/review.route";
import cartRoutes from "./route/cart.route";
import wishListRoute from "./route/wishlist.route";
import orderRoute from "./route/order.routes";
import cors from "cors";

import path from "path";
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/uploads", express.static(path.join(__dirname, "../", "uploads")));

// const connectMongodb = require("./conn/connection.js");
//?connection
connectMongodb(DB_URL);

const PORT = process.env.PORT || 8000;

//?using routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishListRoute);
app.use("/api/order", orderRoute);

app.use(cors());
app.use("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is up and running" });
});

//?handle not found
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const message = `cannot ${req.method} on ${req.originalUrl}`;
  const error = new CustomError(message, 404);
  next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message || "Something went wrong";
  res.status(statusCode).json({
    status,
    success: false,
    message,
  });
});
app.listen(PORT, () =>
  console.log(`server is running onn http://localhost:${PORT}`)
);
