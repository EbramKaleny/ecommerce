import { asyncHandler } from "../error/errorHandler.js";
import { appError } from "../error/classError.js";
import userModel from "../db/models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";

export const signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, age, phone, address } = req.body;
  const userExist = await userModel.findOne({ email: email.toLowerCase() });
  userExist && next(new appError("user already exist", 409));
  const token = jwt.sign({ email }, process.env.signatureKey, {
    expiresln: 60 * 2,
  });
  const link = `${req.protocol}://${req.headers.host}:3000/user/verifyEmai1/${token}`;
  const rfToken = jwt.sign({ email }, process.env.signatureKeyRefresh);
  const rfLink = `${req.protocol}://${req.headers.host}:3000/user/refreshToken/${rfToken}`;
  await sendEmai1(
    email,
    "verify your email",
    `<a href="${link}">click here</a> <br> <a href="${rfLink}">resend email</a>`
  );
  const hash = bcrypt.hashSync(password, 10);
  const user = await userModel.create({
    name,
    email,
    password: hash,
    age,
    phone,
    address,
  });
  res.status(200).json({ msg: "done", user });
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.signatureKey);
  if (!decoded?.email) return next(new appError("invalid token", 400));
  const user = await userModel.findOneAndUpdate(
    { email: decoded.email, confirmed: false },
    { confirmed: true }
  );
  if (!user)
    return next(new appError("user not exists or already confirmed", 400));
  res.status(200).json({ msg: "done" });
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  const { rfToken } = req.params;
  const decoded = jwt.verify(rfToken, process.env.signatureKeyRefresh);
  if (!decoded?.email) return next(new appError("invalid token", 400));
  const user = await userModel.findOne({
    email: decoded.email,
    confirmed: true,
  });
  if (user) return next(new appError("user already confirmed", 400));
  const token = jwt.sign({ email: decoded.email }, process.env.signatureKey, {
    expiresln: 60 * 2,
  });
  const link = `${req.protocol}://${req.headers.host}:3000/user/verifyEmai1/${token}`;
  await sendEmai1(
    decoded.email,
    "verify your email",
    `<a href="${link}">click here</a>`
  );
  res.status(200).json({ msg: "done" });
});

export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email });
  const compare = bcrypt.compareSync(password, user.password);
  if (!user || !compare)
    return next(new appError("email or password is wrong", 400));
  const token = jwt.sign({ email }, process.env.signatureKeySignIn);
  user.loggedln = true;
  await user.save();
  res.status(200).json({ msg: "done", user, token });
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const OTP = customAlphabet("0123456789", 4);
  const hash = bcrypt.hashSync(OTP(), 10);
  const user = await userModel.findOneAndUpdate({ email }, { password: hash });
  if (!user) {
    next(new appError("user dosen't exists", 404));
  }
  const token = jwt.sign({ email }, process.env.signatureKeyResetPassword);
  const link = `${req.protocol}://${req.headers.host}:3000/user/resetPassword/${token}`;
  const checkEmailSender = await sendEmail(
    email,
    `reset yout password`,
    `<a href='${link}'> reset yout password<br>OTP:${OTP()}</a>`
  );
  if (!checkEmailSender) {
    next(new appError("error in sending email", 400));
  }
  res.status(200).json({ msg: "done, check your email" });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { OTP, newPassword } = req.body;
  const { token } = req.params;
  if (!token.startsWith("ebram_")) {
    next(new appError("invalid token", 400));
  }
  const newToken = token.split("ebram_")[1];
  const decoded = jwt.verify(newToken, process.env.signatureKeyResetPassword);
  if (!decoded?.email) {
    next(new appError("something went wrong with reseting password", 400));
  }
  const { email } = decoded;
  const user = await userModel.findOne({ email });
  if (!user) {
    next(new appError("there is no user with this email", 404));
  }
  const compare = bcrypt.compareSync(OTP, user.password);
  if (!compare) {
    next(new appError("OTP is incorrect", 400));
  }
  const hash = bcrypt.hashSync(newPassword, 10);
  user.password = hash;
  await user.save();
  res.status(200).json({ msg: "done", user });
});
