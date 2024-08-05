import {generalValidation, objectIdValidation} from './generalValidation.js';
import joi from 'joi';

export const createReview = {
    body: joi.object({
        rate: joi.number().min(1).max(5).integer().required(),
        comment: joi.string().required()
    }),
    params: joi.object({
        productId: joi.string().custom(objectIdValidation).required(),
    }),
    headers: generalValidation.headers.required()
}

export const deleteReview = {
    params: joi.object({
        id: joi.string().custom(objectIdValidation).required(),
    }),
    headers: generalValidation.headers.required()
}