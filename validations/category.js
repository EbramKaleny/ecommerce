import joi from "joi";
import { systemRoles } from "../service/systemRoles.js";
import { objectIdValidation, generalValidation } from "./generalValidation.js";

export const createCategory = {
    body: joi.object({
        name: joi.string().min(3).max(30).required()
    }).required(),
    file: generalValidation.file.required(),
    headers: generalValidation.headers.required()
}

export const updateCategory = {
    body: joi.object({
        name: joi.string().min(3).max(30)
    }),
    params: joi.object({
        id: joi.string().custom(objectIdValidation).required()
    }),
    file: generalValidation.file,
    headers: generalValidation.headers.required()
}

export const deleteCategory = {
    params: joi.object({
        id: joi.string().custom(objectIdValidation).required()
    }),
    headers: generalValidation.headers.required()
}