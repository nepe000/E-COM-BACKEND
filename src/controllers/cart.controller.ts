// import { create } from "./product.controller";
// import { cart } from "./cart.controller";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/aynchandler.utils";
import CustomError from "../middlewaare/middleware";
import Cart from "../models/cart.model";
import Product from "../models/product.model";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    throw new CustomError("Product ID is required", 404);
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: [],
    });
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();

  res.status(201).json({
    status: "success",
    success: true,
    message: "Product added to cart",
  });
});

export const getCartByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    res.status(200).json({
      status: "success",
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  }
);

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new CustomError("Cart is not created yet", 400);
  }
  await Cart.findOneAndDelete({ user: userId });
  res.status(200).json({
    status: "success",
    success: true,
    message: "Cart cleared successfully",
    data: null,
  });
});

export const removeItemFromCart = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.productId;

    const userId = req.user._id;
    if (!productId) {
      throw new CustomError("ProductId is required", 400);
    }
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new CustomError("Cart is not created yet", 400);
    }
    // const  = cart.items.filter(
    //   (item) => item.product.toString()! === productId
    // );
    cart.items.pull({ product: productId });

    const updatedCart = await cart.save();
    res.status(200).json({
      status: "success",
      success: true,
      message: "cart cleared successfully",
      data: updatedCart,
    });
  }
);
