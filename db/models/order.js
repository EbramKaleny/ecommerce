import mongoose, { Types } from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: Types.ObjectId,
    ref: "user",
    required: true
  },
  products: [{
    productId: {
      type: Types.ObjectId,
      ref: "product",
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    finalPrice: {
      type: Number,
      required: true
    }
  }],
  subPrice: {
    type: Number,
    required: true
  },
  couponId: {
    type: Types.ObjectId,
    ref: "coupon",
  },
  totalPrice: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["card", "cash"]
  },
  status: {
    type: String,
    enum: ["placed", "waitPayment", "delivered", "onWay", "cancelled", "rejected"],
    default: "placed"
  },
  cancelledBy: {
    type: Types.ObjectId,
    ref: "user"
  },
  reason: {type: String}
},{
  timestamps: true,
  versionKey: false
});

const orderModel = mongoose.model("order",orderSchema)
export default orderModel