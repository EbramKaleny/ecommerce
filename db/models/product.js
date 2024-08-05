import mongoose, { Types } from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minLength: 3,
    maxLength:30,
    trim: true,
    unique: true,
    lowercase: true
  },
  slug:{
    type: String,
    minLength: 3,
    maxLength: 30,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    minLength: 3,
    trim: true
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "user",
    required: true
  },
  image: {
    secure_url:String,
    public_id: String
  },
  coverImages: {
    secure_url:String,
    public_id: String
  },
  customeId: String,
  category: {
    type: Types.ObjectId,
    ref: "category",
    required: true
  },
  subCategory: {
    type: Types.ObjectId,
    ref: "subcategory",
    required: true
  },
  brand: {
    type: Types.ObjectId,
    ref: "brand",
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 1
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  subPrice: {
    type: Number,
    min: 1
  },
  stock: {
    type: Number,
    required: true
  },
  rateAvg: {
    type: Number,
    default: 0
  },
  rateNum: {
    type: Number,
    default: 0
  }
});

const productModel = mongoose.model("product",productSchema)
export default productModel