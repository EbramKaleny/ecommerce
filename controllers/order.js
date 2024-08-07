import { asyncHandler } from "../error/errorHandler.js";
import { appError } from "../error/classError.js";
import orderModel from "../db/models/order.js";
import couponModel from "../db/models/coupon.js";
import productModel from "../db/models/product.js";
import cartModel from "../db/models/cart.js";
import createInvoice from "../service/invoice.js";
import { sendEmail } from "../service/sendEmail.js";
import { payment } from "../service/payment.js";
import Stripe from "stripe";

export const createOrder = asyncHandler(async (req, res, next) => {
  const { productId, quantity, couponCode, address, phone, paymentMethod } =
    req.body;

  if (couponCode) {
    const coupon = await couponModel.findOne({
      code: couponCode.toLowerCase(),
      usedBy: { $nin: [req.user._id] },
    });
    if (!coupon || coupon.toDate < Date.now()) {
      next(new appError("coupon not exist or expired", 404));
    }
    req.body.coupon = coupon;
  }

  let products = [];
  let flag = false;
  if (productId) {
    products = [{ productId, quantity }];
  } else {
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart.products.length) {
      next(new appError("cart is empty", 404));
    }
    products = cart.products;
    flag = true;
  }

  let finalProducts = [];
  for (let product of products) {
    const checkProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
    });
    if (!checkProduct) {
      next(new appError("product not exist or out of stock", 404));
    }
    if (flag) {
      product = product.toObject();
    }
    product.name = checkProduct.name;
    product.price = checkProduct.price;
    product.finalPrice = checkProduct.subPrice * product.quantity;
    subPrice += product.finalPrice;

    finalProducts.push(product);
  }

  const order = await orderModel.create({
    user: req.user._id,
    products: finalProducts,
    subPrice,
    couponId: req.body?.coupon?._id,
    totalPrice: subPrice - subPrice * ((req.body.coupon?.amount || 0) / 100),
    paymentMethod,
    status: paymentMethod == "cash" ? "placed" : "waitPayment",
    phone,
    address,
  });

  if (req.body?.coupon) {
    await couponModel.updateOne(
      { _id: req.body.coupon._id },
      { $push: { usedBy: req.user._id } }
    );
  }

  for (const product of finalProducts) {
    await productModel.findOneAndUpdate(
      { _id: product.productId },
      { $inc: { stock: -product.quantity } }
    );
  }

  if (flag) {
    await cartModel.updateOne({ user: req.user._id }, { products: [] });
  }

  const invoice = {
    shipping: {
      name: req.user.name,
      address: req.user.address,
      city: "San Francisco",
      state: "CA",
      country: "US",
      postal_code: 94111,
    },
    items: order.products,
    subtotal: order.subPrice,
    paid: order.totalPrice,
    invoice_nr: order._id,
    date: order.createdAt,
    coupon: req.body?.coupon?.amount || 0,
  };
  await createInvoice(invoice, "invoice.pdf");

  await sendEmail(
    req.user.email,
    "Order Placed",
    `your order has been placed successfully`,
    [
      {
        path: "invoice.pdf",
        contentType: "application/pdf",
      },
      {
        path: "route.jpeg",
        contentType: "image/pdf",
      },
    ]
  );

  if (paymentMethod == "card") {
    const stripe = new Stripe(process.env.stripe_secret);

    if(req.body?.coupon){
      const coupon = await stripe.coupons.create({
        percent_off: req.body.coupon.amount,
        duration: "once"
      })
      req.body.couponId = coupon.id
    }

    const seasion = await payment({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      metadata: {
        orderId: order._id.toString(),
      },
      success_url: `${req.protocol}://${req.headers.host}/order/success/${order._id}`,
      cancel_url: `${req.protocol}://${req.headers.host}/order/cancel/${order._id}`,
      line_items: order.products.map((product) => {
        return {
          price_data: {
            currency: "egp",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100,
          },
          quantity: product.quantity,
        };
      }),
      discounts: req.body?.coupon ? [{coupon: req.body.couponId}] : [],
    });
    return res.status(200).json({msg: "done", url: seasion.url})
  }

  return res.status(200).json({ msg: "done", order });
});

export const cancleOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;

  const order = await orderModel.findOne({ _id: id, user: req.user._id });
  if (!order) {
    next(new appError("order not found", 404));
  }
  if (
    (order.paymentMethod === "cash" && order.status != "placed") ||
    (order.paymentMethod === "card" && order.status != "waitPayment")
  ) {
    next(new appError("cannot cancel this order", 400));
  }

  await orderModel.updateOne(
    { _id: id },
    {
      status: "cancelled",
      cancelledBy: req.user._id,
      reason,
    }
  );

  if (order?.couponId) {
    await couponModel.updateOne(
      { _id: order.couponId },
      {
        $pull: { usedBy: req.user._id },
      }
    );
  }

  for (const product of order.products) {
    await productModel.updateOne(
      { _id: product.productId },
      {
        $inc: { stock: product.quantity },
      }
    );
  }

  res.status(204).json({ msg: "done" });
});
