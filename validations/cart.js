import {generalValidation, objectIdValidation} from './generalValidation.js';
import joi from 'joi';

export const createCart = {
    body: joi.object({
        productId: joi.string().custom(objectIdValidation).required(),
        quantity: joi.number().integer().required()
    }),
    headers: generalValidation.headers.required()
}

export const removeCart = {
    body: joi.object({
        productId: joi.string().custom(objectIdValidation).required()
    }),
    headers: generalValidation.headers.required()
}

export const clearCart = {
    headers: generalValidation.headers.required()
}