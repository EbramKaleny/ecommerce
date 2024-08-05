import joi from "joi";

export const signUpValidation = {
  body: joi.object({
    name: joi.string().min(3).max(15).required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/))
      .required(),
    address: joi.string().required(),
    age: joi.number(),
    phone: joi
      .array()
      .items(
        joi
          .string()
          .pattern(new RegExp(/^01[0-2,5]{1}[0-9]{8}$/))
          .required()
      )
      .unique()
      .required(),
  }).required(),
};

export const verifyEmail = {
  params: joi.object({
    token: joi.string().required(),
  }).required(),
};

export const refreshToken = {
  params: joi.object({
    rfToken: joi.string().required(),
  }).required(),
};

export const signIn = {
  body: joi.object({
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/))
      .required(),
  }).required(),
};

export const forgetPassword = {
  body: joi.object({
    email: joi.string().email().required(),
  }).required(),
};

export const resetPassword = {
  body: joi.object({
    OTP: joi.string().min(4).max(4).required(),
    newPassword: joi
      .string()
      .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/))
      .required(),
  }).required(),
  params: joi.object({
    token: joi.string().required(),
  }).required(),
};
