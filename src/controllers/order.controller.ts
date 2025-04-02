import { Request, Response } from "express";
import { asyncHandler } from "../utils/aynchandler.utils";
import Cart from "../models/cart.model";
import CustomError from "../middlewaare/middleware";
import product from "../models/product.model";
import order from "../models/order.model";
import { sendOrderConfirmationEmail } from "../utils/orderconfirmation";
import { getPaginationData } from "../utils/pagination.utils";

export const placeOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new CustomError("Cart not found", 404);
  }
  const products = await Promise.all(
    cart.items.map(async (item: any) => {
      const Product = await product.findById(item.product);
      if (!Product) {
        throw new CustomError("Product not found", 404);
      }
      return {
        product: Product._id,
        quantity: item.quantity,
        totalPrice: Number(Product.price) * item.quantity,
      };
    })
  );
  const totalAmount = products.reduce((acc, item) => acc + item.totalPrice, 0);

  const Order = new order({
    user: userId,
    items: products,
    totalAmount,
  });
  const newOrder = await Order.save();
  const populatedOrder = await order
    .findById(newOrder._id)
    .populate("items.product");
  if (!populatedOrder) {
    throw new CustomError("order not created", 404);
  }
  await sendOrderConfirmationEmail({
    to: req.user.email,
    orderDetails: populatedOrder,
  });

  await Cart.findByIdAndDelete(cart._id);

  res.status(201).json({
    status: "Success",
    success: true,
    data: newOrder,
    message: "Order placed successfully!",
  });
});

//?Get all order
export const getAllOrder = asyncHandler(async (req: Request, res: Response) => {
  const { limit, page, status, query, minTotal, maxTotal, toDate, fromDate } =
    req.query;
  let filter: Record<string, any> = {};
  if (status) {
    filter.orderId = { $regex: query, $options: "i" };
  }
  //date filter

  if (toDate || fromDate) {
    if (toDate || fromDate)
      if (minTotal && maxTotal) {
        filter.createdAt = {
          $lte: new Date(toDate as string),
          $gte: new Date(fromDate as string),
        };
      }
    if (fromDate) {
      filter.createdAt = { $gte: new Date(fromDate as string) };
    }
    if (toDate) {
      filter.createdAt = { $lte: new Date(toDate as string) };
    }
  }
  if (minTotal || maxTotal)
    if (minTotal && maxTotal) {
      filter.totalAmount = {
        $lte: parseFloat(maxTotal as string),
        $gte: parseFloat(minTotal as string),
      };
    }
  if (minTotal) {
    filter.totalAmount = { $lte: parseFloat(maxTotal as string) };
  }
  if (maxTotal) {
    filter.totalAmount = { $gte: parseFloat(minTotal as string) };
  }

  const currentPage = parseInt(page as string) || 10;
  const perPage = parseInt(limit as string) || 1;
  const skip = (currentPage - 1) * perPage;
  if (query) {
    filter.orderId = { $regex: query, $options: "i" };
  }

  const allOrder = await order
    .find(filter)
    .skip(skip)
    .sort({ createdAt: -1 })
    .populate("items.product")
    .populate("user");

  const totalCount = await order.countDocuments(filter);
  res.status(201).json({
    success: true,
    status: "Success",
    data: {
      data: allOrder,
      pagination: getPaginationData(currentPage, perPage, totalCount),
    },
    message: "Order fetched successfully!",
  });
});

//?Get by userID
export const getOrderByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const Order = await order
      .findOne({ user: userId })
      .populate("items.product")
      .populate("user", "-password");

    res.status(201).json({
      success: true,
      status: "Success",
      data: Order,
      message: "Order fetched successfully!",
    });
  }
);

//? Update Order  status
export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) {
      throw new CustomError("status is required", 404);
    }
    if (!orderId) {
      throw new CustomError("orderId is required", 404);
    }
    const updateOrder = await order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updateOrder) {
      throw new CustomError("updateOrder is required", 404);
    }
    res.status(200).json({
      success: true,
      status: "Success",
      data: updateOrder,
      message: "Order status updated successfully!",
    });
  }
);

//?Delete Order
export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new CustomError("orderId is required", 404);
  }
  const deleteOrder = await order.findByIdAndDelete(orderId);
  if (!deleteOrder) {
    throw new CustomError("updateOrder is required", 404);
  }
  res.status(200).json({
    success: true,
    status: "Success",
    data: deleteOrder,
    message: "Order deleted successfully!",
  });
});

//?Cancel order status
