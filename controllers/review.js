import { asyncHandler } from "../error/errorHandler.js";
import { appError } from "../error/classError.js";
import orderModel from "../db/models/order.js";
import reviewModel from '../db/models/review.js';
import productModel from "../db/models/product.js";

export const createReview = asyncHandler(async (req, res, next) => {
  const {comment, rate} = req.body
  const {productId} = req.params

  const product = await productModel.findById(productId)
  if(!product){
    next(new appError("product not found", 404))
  }

  const reviewExist = await reviewModel.findOne({createdBy: req.user._id, productId})
  if(reviewExist){
    next(new appError("you already placed your review", 400))
  }

  const order = await orderModel.findOne({
    user: req.user._id,
    "products.productId": productId,
    status: "delivered"
  })
  if(!order){
    next(new appError("you cannot review on product you didn't order", 400))
  }

  const review = await reviewModel.create({
    comment,
    rate,
    productId,
    createdBy: req.user._id
  })

  let sum = product.rateAvg * product.rateNum
  sum += rate

  product.rateAvg = sum / (product.rateNum + 1)
  product.rateNum += 1
  await product.save()

  return res.status(200).json({ msg: "done", review });
});

export const deleteReview = asyncHandler(async (req, res, next) => {
  const {id} = req.params

  const review = await reviewModel.findOneAndDelete({_id: id, createdBy: req.user._id})
  if(!review) {
    next(new appError("review doesn't exist", 404))
  }

  const product = await productModel.findById(review.productId)

  let sum = product.rateAvg * product.rateNum
  sum -= review.rate

  product.rateAvg = sum / (product.rateNum - 1)
  product.rateNum -= 1
  await product.save()

  res.status(204).json({msg:"done"})
})