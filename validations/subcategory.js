import joi from "joi";
import { systemRoles } from "../service/systemRoles.js";
import { objectIdValidation, generalValidation } from "./generalValidation.js";

export const createSubCategory = {
    body: joi.object({
        name: joi.string().min(3).max(30).required(),
        category: joi.string().custom(objectIdValidation).required()
    }).required(),
    file: generalValidation.file.required(),
    headers: generalValidation.headers.required()
}

export const updateSubCategory = {
    body: joi.object({
        name: joi.string().min(3).max(30)
    }),
    params: joi.object({
        id: joi.string().custom(objectIdValidation).required()
    }),
    file: generalValidation.file,
    headers: generalValidation.headers.required()
}

export const deleteSubCategory = {
    params: joi.object({
        id: joi.string().custom(objectIdValidation).required()
    }),
    headers: generalValidation.headers.required()
}