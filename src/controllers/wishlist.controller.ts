// import { model } from "mongoose";
import User from "../models/model";

import { Response, Request } from "express";
import { asyncHandler } from "../utils/aynchandler.utils";
import CustomError from "../middlewaare/middleware";
import Product from "../models/product.model";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const { productId } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError("User not found", 404);
  }
  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("product not found", 404);
  }

  const existingProduct = user.wishList.find(
    (list) => list.toString() === productId
  );
  if (!existingProduct) {
    user.wishList.push(productId);
    await user.save();
  }
  res.status(201).json({
    status: "success",
    success: true,
    data: user.wishList,
    message: "added to wishlist successfully",
  });
});

export const removeProductFromWishList = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const productId = req.params.productId;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    const existingProduct = user.wishList.find(
      (list) => list.toString() === productId
    );
    if (!existingProduct) {
      throw new CustomError("Product does not exist in list", 404);
    }
    user.wishList.pull(productId);
    await user.save();
    res.status(201).json({
      status: "success",
      success: true,
      data: user.wishList,
      message: "added to wishlist successfully",
    });
  }
);

export const getByUserId = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user._id;

  const user = await User.findById(id).populate("wishList");
  if (!user) {
    throw new CustomError("User is not there ", 404);
  }
  res.status(202).json({
    status: "success",
    success: true,
    data: user.wishList,
    message: "wishlist is fetched successfully using id",
  });
});

export const clear = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user._id;

  const user = await User.findById(id).populate("wishList");
  if (!user) {
    throw new CustomError("User is not there ", 404);
  }
  user.wishList = [] as any;
  await user.save();
  res.status(202).json({
    status: "success",
    success: true,
    data: user.wishList,
    message: "wishlist is fetched successfully using id",
  });
});
