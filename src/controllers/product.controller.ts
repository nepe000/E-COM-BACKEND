import { Request, Response } from "express";
import { asyncHandler } from "../utils/aynchandler.utils";
import Product from "../models/product.model";

import CustomError from "../middlewaare/middleware";
import { deleteFiles } from "../utils/deleteFile.util";
import Category from "../models/category.model";
import { getPaginationData } from "../utils/pagination.utils";

export const create = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, price, description, category: categoryId } = req.body;

    const admin = req.user;
    const files = req.files as {
      coverImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
    };

    if (!files || !files.coverImage) {
      throw new CustomError("cover image is required", 400);
    }
    const coverImage = files.coverImage;
    const images = files.images;

    // get category
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new CustomError("category not found", 404);
    }

    const product = new Product({
      name,
      price,
      description,
      createdBy: admin._id,
      category: category._id,
    });

    product.coverImage = {
      path: coverImage[0].path,
      public_id: coverImage[0].fieldname,
    } as any;

    if (images && images.length > 0) {
      const imagePaths = images.map((image: any, index: number) => ({
        path: image.path,
        public_id: image.fieldname,
      }));

      product.images = imagePaths as any;
    }

    await product.save();
    // console.log(req.file);

    res.status(200).json({
      status: "success",
      success: true,
      data: product,
      message: "Product created successfully",
    });
  }
);

export const getAll = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { limit, page, query, category, minPrice, maxPrice } = req.query;
    const queryLimit = parseInt(limit as string) || 10;
    const currentPage = parseInt(page as string) || 1;
    const skip = (currentPage - 1) * queryLimit;
    let filter: Record<string, any> = {};

    if (category) {
      filter.category = category;
    }
    if (minPrice && maxPrice) {
      filter.price = {
        $lte: parseFloat(maxPrice as string),
        $gte: parseFloat(minPrice as string),
      };
    }
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

    const products = await Product.find(filter)
      .skip(skip)
      .limit(queryLimit)
      .populate("createdBy")
      .sort({ createdAt: -1 })
      .populate("category");

    const totalCount = await Product.countDocuments(filter);

    const pagination = getPaginationData(currentPage, queryLimit, totalCount);

    res.status(200).json({
      success: true,
      status: "success",
      data: {
        data: products,
        pagination,
      },
      message: "Products fetched successfully",
    });
  }
);
export const updatePro = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { deletedImages, name, description, price, category } = req.body;
    const id = req.params.id;
    const { coverImage, images } = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Validate category first
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new CustomError("Category not found", 404);
    }

    // Find and update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, category },
      { new: true }
    );

    if (!updatedProduct) {
      throw new CustomError("Product not found", 400);
    }

    // Delete cover image if provided
    if (coverImage) {
      await deleteFiles([updatedProduct.coverImage as any]);
      updatedProduct.coverImage = {
        path: coverImage[0].path,
        public_id: coverImage[0].fieldname,
      } as any;
    }

    // Delete selected images
    if (deletedImages && deletedImages.length > 0) {
      await deleteFiles(deletedImages);
      updatedProduct.images = (updatedProduct.images || []).filter(
        (image) => !deletedImages.includes(image.public_id)
      );
    }

    // Add new images if provided
    if (images && images.length > 0) {
      const imagePath = images.map((image) => {
        return {
          path: image.path,
          public_id: image.filename,
        };
      });
      updatedProduct.images = [...(updatedProduct.images || []), ...imagePath];
    }

    await updatedProduct.save();

    res.status(200).json({
      status: "success",
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    });
  }
);

export const deletePro = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      throw new CustomError("Product is not here", 404);
    }

    if (product.coverImage && product.coverImage.length > 0) {
      const coverImageIds = product.coverImage.map((img) => img.public_id);
      await deleteFiles(coverImageIds);
    }

    // Handle product images
    if (product.images && product.images.length > 0) {
      const imageIds = product.images.map((img) => img.public_id);
      await deleteFiles(imageIds);
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      success: true,
      data: product,
      message: "Product deleted successfully",
    });
  }
);
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate("createdBy");
  res.status(200).json({
    success: true,
    status: "success",
    data: product,
    message: "product fetched successfully",
  });
});
