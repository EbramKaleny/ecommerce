import mongoose, { Types } from "mongoose";

const subcategorySchema = new mongoose.Schema({
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
  createdBy: {
    type: Types.ObjectId,
    ref: "user",
    required: true
  },
  image: {
    secure_url:String,
    public_id: String
  },
  customeId:{
    type: String,
    minLength: 5,
    maxLength: 5,
  },
  category: {
    type: Types.ObjectId,
    ref:"category",
    required: true
  }
});

const subcategoryModel = mongoose.model("subcategory",subcategorySchema)
export default subcategoryModel