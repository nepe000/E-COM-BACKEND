import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

const Category = mongoose.model("category", categorySchema);
export default Category;
