import { Request, Response } from "express";
import { asyncHandler } from "../utils/aynchandler.utils";

import Review from "../models/review.model";
import Product from "../models/product.model";
import CustomError from "../middlewaare/middleware";
import { getPaginationData } from "../utils/pagination.utils";

export const createRev = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const user = req.user;
  const { productId, rating, review } = body;
  if (!productId) {
    throw new CustomError("userid and product id are required", 400);
  }
  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("product not found", 404);
  }

  const reviews: any[] = product.reviews ?? [];
  const newReview = await Review.create({
    ...body,
    product: productId,
    user: user,
  });
  reviews?.push(newReview._id);
  const totalRating: number =
    (product?.avgRating as number) * reviews.length - 1 + Number(rating);
  product.avgRating = totalRating / reviews.length;
  await product.save();

  res.status(200).json({
    status: "success",
    success: true,
    data: newReview,
    message: "Reviews for the product is created successfully",
  });
});

export const allRev = asyncHandler(async (req: Request, res: Response) => {
  const { limit, page } = req.query;

  const perPage = parseInt(limit as string) || 10;
  const currentPage = parseInt(page as string) || 1;
  const skip = (currentPage - 1) * perPage;

  const { rating } = req.query;
  const filteredRating = Number(rating);
  const filter: any = {};
  if (!isNaN(filteredRating) && filteredRating >= 1 && filteredRating <= 5) {
    filter.rating = filteredRating;
  }

  const review = await Review.find(filter)
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: -1 })
    .populate("user")
    .populate("product");

  const totalCount = await Review.countDocuments();
  res.status(200).json({
    status: "success",
    success: true,
    data: {
      data: review,
      pagination: getPaginationData(currentPage, perPage, totalCount),
    },
    message: "All the Reviews are found",
  });
});

export const updateRev = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { rating, review } = req.body;
    console.log(typeof rating);
    if (typeof Number(rating) !== "number") {
      throw new CustomError("Review must be number type", 400);
    }
    const id = req.params.id;
    const existingReview = await Review.findById(id);
    if (!existingReview) {
      throw new CustomError("Review not found", 404);
    }
    const product = await Product.findById(existingReview.product);
    if (!product) {
      throw new CustomError("Product not found", 404);
    }
    const newRating =
      Number(product?.avgRating) * product?.reviews.length -
      existingReview.rating +
      Number(rating);
    product.avgRating = newRating / product.reviews.length;
    await product?.save();

    const updatedRev = await Review.findByIdAndUpdate(
      id,
      { rating, review },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      success: true,
      data: updatedRev,
      message: "Review updated successfully",
    });
  }
);

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const review = await Review.findById(id).populate("");
  if (!review) {
    throw new CustomError("Review not found", 404);
  }
  const product = await Product.findById(review.product);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }
  product?.reviews.pull(review._id);
  if (product?.reviews.length === 0) {
    product.avgRating = 0;
  } else {
    product.avgRating =
      Number(product.avgRating) * (product?.reviews.length + 1) -
      review.rating / product?.reviews.length;
  }
  await Review.findByIdAndDelete(review._id);
  await product?.save();
  res.status(200).json({
    status: "success",
    success: true,
    data: product,
    message: "Review updated successfully",
  });
});

export const getReviewByIdProductId = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.id;
    const reviews = await Review.find({ product: productId }).populate("user");

    res.status(200).json({
      success: true,
      status: "success",
      data: reviews,
    });
  }
);
