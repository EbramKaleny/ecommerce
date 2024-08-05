import joi from "joi";
import mongoose from "mongoose";

export const generalValidation = {
  headers: joi.object({
    "cache-control": joi.string(),
    "postman-token": joi.string(),
    "content-type": joi.string(),
    "content-length": joi.string(),
    host: joi.string(),
    "user-agent": joi.string(),
    accept: joi.string(),
    "accept-encoding": joi.string(),
    connection: joi.string(),
    token: joi.string().required(),
  }),
  file: joi
    .object({
      size: joi.number().positive().required(),
      path: joi.string().required(),
      filename: joi.string().required(),
      destination: joi.string().required(),
      mimetype: joi.string().required(),
      encoding: joi.string().required(),
      originalname: joi.string().required(),
      fieldname: joi.string().required(),
    })
    .required(),
};

export const objectIdValidation = (value, helper) => {
  return mongoose.Types.ObjectId.isValid(value)
    ? true
    : helper.message("invalid id");
};
