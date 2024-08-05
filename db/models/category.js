import mongoose, { Types } from "mongoose";
import { systemRoles } from "../../service/systemRoles.js";

const categorySchema = new mongoose.Schema({
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
  }
});

const categoryModel = mongoose.model("category",categorySchema)
export default categoryModel