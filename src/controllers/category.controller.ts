import { Request, Response } from "express";
import { asyncHandler } from "../utils/aynchandler.utils";
import Category from "../models/category.model";
import mongoose from "mongoose";
import CustomError from "../middlewaare/middleware";
import { getPaginationData } from "../utils/pagination.utils";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const category = await Category.create(body);
  res.status(200).json({
    status: "success",
    success: true,
    data: category,
    message: "category for the product is created successfully",
  });
});

export const allCat = asyncHandler(async (req: Request, res: Response) => {
  const { limit, page, query } = req.query;
  let filter: Record<string, any> = {};
  if (query) {
    filter.$or = [
      {
        name: { $regex: query, $options: "i" },
      },
      {
        description: { $regex: query, $options: "i" },
      },
    ];
  }

  const queryLimit = parseInt(limit as string) || 10;
  const currPage = parseInt(page as string) || 1;
  const skip = (currPage - 1) * queryLimit;

  const category = await Category.find({})
    .skip(skip)
    .limit(queryLimit)
    .sort({ createdAt: -1 });

  const totalCount = await Category.countDocuments();

  const pagination = getPaginationData(currPage, queryLimit, totalCount);
  res.status(200).json({
    status: "success",
    success: true,
    data: { data: category, pagination },
    message: "All the categories are found",
  });
});

export const updateCat = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const { name, description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        status: "error",
        success: false,
        message: "Invalid product ID",
      });
      return;
    }
    const updateCat = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      success: true,
      data: updateCat,
      message: "Category updated successfully",
    });
  }
);

export const remove = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    const category = await Category.findById(id);
    if (!category) {
      throw new CustomError("category not found ", 404);
    }
    await Category.findByIdAndDelete(category._id);

    res.status(200).json({
      status: "success",
      success: true,
      data: category,
      message: "Category deleted successfully",
    });
  }
);

export const getById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    const category = await Category.findById(id);
    if (!category) {
      throw new CustomError("category not found ", 404);
    }

    res.status(200).json({
      status: "success",
      success: true,
      data: category,
      message: "Category fetched successfully",
    });
  }
);
