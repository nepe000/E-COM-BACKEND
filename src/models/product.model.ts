import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name ios required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is needed"],
      min: [0, "Price should be greater than zero"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
    description: {
      type: String,
      required: false,
      min: [50, "description should be at least 50 characters long"],
      trim: true,
    },
    coverImage: {
      type: String,
      required: false,
    },
    images: [
      {
        type: String,
        required: false,
      },
    ],
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "review",
        required: true,
        default: [],
      },
    ],
    avgRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);
export default Product;
