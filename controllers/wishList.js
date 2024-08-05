import { asyncHandler } from "../error/errorHandler.js";
import { appError } from "../error/classError.js";
import productModel from "../db/models/product.js";
import wishListModel from "../db/models/wishList.js";

export const addWishList = asyncHandler(async (req, res, next) => {
  const {productId} = req.params

  const product = await productModel.findById(productId)
  if(!product){
    next(new appError("product not found", 404))
  }

  let wishList = await wishListModel.findOne({user: req.user._id})
  if(!wishList){
    const newWishList = await wishListModel.create({
      user: req.user._id,
      products: [productId]
    })
    return res.status(201).json({msg: "done", wishList: newWishList})
  }
  wishList.products.addToSet(productId)
  await wishList.save()

  res.status(201).json({msg: "done", wishList})
});

