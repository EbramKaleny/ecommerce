import {generalValidation, objectIdValidation} from './generalValidation.js';
import joi from 'joi';

export const createOrder = {
    body: joi.object({
        productId: joi.string().custom(objectIdValidation),
        quantity: joi.number().integer(),
        phone: joi.string().required(),
        address: joi.string().required(),
        couponCode: joi.string().min(3),
        paymentMethod: joi.string().valid("card", "cash").required()
    }),
    headers: generalValidation.headers.required()
}

export const cancleOrder = {
    body: joi.object({
        reason: joi.string().min(3)
    }),
    params: joi.object({
        id: joi.string().custom(objectIdValidation).required()
    }).required(),
    headers: generalValidation.headers.required()
}