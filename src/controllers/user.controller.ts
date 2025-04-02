import { Request, Response } from "express";
import User from "../models/model";
import { generateToken } from "../utils/jwt.util";

import { hash, compare } from "../utils/bcrypt.util";
import { iPayload } from "../@types/jwt.interface";
import { asyncHandler } from "../utils/aynchandler.utils";
import CustomError from "../middlewaare/middleware";
import { Role } from "../@types/gloabl.types";
import { getPaginationData } from "../utils/pagination.utils";

// import { compare } from "bcryptjs";
export const register = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;

  if (!body.password) {
    throw new CustomError("Password is required", 400);
  }

  const hashedPassword = await hash(body.password);
  body.password = hashedPassword;

  const user = await User.create(body);

  const payload: iPayload = {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };

  const token = generateToken(payload);

  res.status(201).json({
    status: "success",
    success: true,
    message: "User registered successfully",
    data: user,
    token,
  });
});
export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { firstName, lastName, gender, phoneNumber } = req.body;

  const check = await User.findByIdAndUpdate(
    id,
    { firstName, lastName, gender, phoneNumber },
    { new: true }
  );
  if (!check) {
    // res.status(500).json({
    //   status: "failed",
    //   success: false,
    //   message: "User is not there",
    // });
    throw new CustomError("User is not there", 400);
  }

  res.status(201).json({
    status: "success",
    success: true,
    message: "user registered successfully",
  });
});

//? export const login = (req,res) =>{} 1.email pass 2.user.findone({email:email}) 3.if(!user) 4.user.pass===body.pass 5.if(!pass)=>error throw
//? 6. res.success =>login successful

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    throw new CustomError("Email is required", 400);
  }
  if (!password) {
    throw new CustomError("Password is required", 400);
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CustomError("User not found, please register", 404);
  }

  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    throw new CustomError("Incorrect password", 400);
  }

  const payload: iPayload = {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
  const token = generateToken(payload);

  res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({
      status: "success",
      success: true,
      message: "Login success",
      token,
    });
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  console.log(req.user);
  const id = req.user._id;
  const { sortBy, order } = req.query;
  let filter: Record<string, any> = {};

  const { limit, page, query } = req.query;
  const perPage = parseInt(limit as string);
  const currentPage = parseInt(page as string);
  const skip = (currentPage - 1) * perPage;
  if (query) {
    filter.$or = [
      {
        firstName: { $regex: query, $options: "i" },
      },
      {
        lastName: { $regex: query, $options: "i" },
      },
      {
        email: { $regex: query, $options: "i" },
      },
      {
        phoneNo: { $regex: query, $options: "i" },
      },
    ];
  }

  filter.role = Role.user;

  let sortOptions: { [key: string]: 1 | -1 } = { createdAt: -1 }; // newest user sort

  if (
    sortBy &&
    ["createdAt", "lastLogin", "updatedAt"].includes(sortBy as string)
  ) {
    sortOptions = { [sortBy as string]: order === "asc" ? 1 : -1 };
  }
  const users = await User.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: -1 })
    .exec();
  const totalCount = await User.countDocuments(filter);

  const allUsers = await User.find({ _id: id });
  res.status(201).json({
    status: "success",
    success: true,
    message: "user registered successfully",
    data: {
      allUsers,
      data: users,
      pagination: getPaginationData(currentPage, perPage, totalCount),
    },
  });
});
