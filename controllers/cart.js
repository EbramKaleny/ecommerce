import { asyncHandler } from "../error/errorHandler.js";
import { appError } from "../error/classError.js";
import productModel from "../db/models/product.js";
import cartModel from "../db/models/cart.js";

export const createCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const productExist = await productModel.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });
  if (!productExist) {
    next(new appError("product not exists or out of stock", 404));
  }

  let cartExists = await cartModel.findOne({ user: req.user._id });
  if (!cartExists) {
    const cart = await cartModel.create({
      user: req.user._id,
      products: [
        {
          productId,
          quantity,
        },
      ],
    });
    return res.status(200).json({ msg: "done", cart });
  }

  let flag = false;
  for (const product of cartExists.products) {
    if (productId == product.productId) {
      product.quantity = quantity;
      flag = true;
    }
  }

  if (!flag) {
    cartExists.products.push({
      productId,
      quantity,
    });
  }
  await cartExists.save();
  res.status(200).json({ msg: "done", coupon });
});

export const removeCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  const cartExists = await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
      "products.productId": productId,
    },
    {
      $pull: { products: { productId } },
    },
    {
      new: true,
    }
  );

  if (!cartExists) {
    next(new appError("cart dosen't exists", 404));
  }
  res.status(200).json({ msg: "done", cart: cartExists });
});

export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { products: [] },
    { new: true }
  );

  if (!cart) {
    next(new appError("cart not found", 404));
  }
  res.status(200).json({ msg: "done", cart });
});
