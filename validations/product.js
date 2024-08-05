import joi from "joi";
import { systemRoles } from "../service/systemRoles.js";
import { objectIdValidation, generalValidation } from "./generalValidation.js";

export const createProduct = {
    body: joi.object({
        name: joi.string().min(3).max(30).required(),
        stock: joi.number().min(1).integer().required(),
        discount: joi.number().min(1).max(100),
        price: joi.number().min(1).integer().required(),
        brand: joi.string().custom(objectIdValidation).required(),
        subCategory: joi.string().custom(objectIdValidation).required(),
        category: joi.string().custom(objectIdValidation).required(),
        description: joi.string()
    }),
    files: joi.object({
        image: joi.array().items(generalValidation.file.required()).required(),
        coverImages: joi.array().items(generalValidation.file.required()).required()
    }).required(),
    headers: generalValidation.headers.required()
}

export const updateProduct = {
    body: joi.object({
        name: joi.string().min(3).max(30),
        stock: joi.number().min(1).integer(),
        discount: joi.number().min(1).max(100),
        price: joi.number().min(1).integer(),
        brand: joi.string().custom(objectIdValidation).required(),
        subCategory: joi.string().custom(objectIdValidation).required(),
        category: joi.string().custom(objectIdValidation).required(),
        description: joi.string()
    }),
    params: joi.object({
        id: joi.string().custom(objectIdValidation).required(),
    }),
    files: joi.object({
        image: joi.array().items(generalValidation.file),
        coverImages: joi.array().items(generalValidation.file)
    }),
    headers: generalValidation.headers.required()
}