import {asyncHandler} from '../error/errorHandler.js';
import {appError} from '../error/classError.js';
import couponModel from '../db/models/coupon.js';

export const createCoupon = asyncHandler(async (req, res, next) => {
    const {code, amount, fromDate, toDate} = req.body

    const exists = await couponModel.findOne({code: code.toLowerCase()})
    if(exists){
        next(new appError("coupon already exists", 409))
    }

    const coupon = await couponModel.create({
        code,
        amount,
        fromDate,
        toDate,
        createdBy: req.user._id
    })

    res.status(200).json({msg:"done", coupon})
})

export const updateCoupon = asyncHandler(async (req, res, next) => {
    const {id} = req.params
    const {code, amount, fromDate, toDate} = req.body

    const coupon = await couponModel.findOneAndUpdate({
        _id: id, createdBy: req.user._id
    }, {
        code,
        amount,
        fromDate,
        toDate
    }, {
        new: true
    })

    if(!coupon){
        next(new appError("there is no coupon found", 404))
    }
    res.status(200).json({msg: "done", coupon})
})