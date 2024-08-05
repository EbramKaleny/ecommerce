import {generalValidation, objectIdValidation} from './generalValidation.js';
import joi from 'joi';

export const addWishList = {
    params: joi.object({
        productId: joi.string().custom(objectIdValidation).required(),
    }),
    headers: generalValidation.headers.required()
}