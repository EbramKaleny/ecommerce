import mongoose, { Types } from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "coupon code is required"],
        minLength: 3,
        maxLength: 30,
        trim: true,
        lowercase: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true,
        min:1,
        max:100
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },
    usedBy: [{
        type: Types.ObjectId,
        ref:"user"
    }],
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    }
},{
    timestamps:true,
    versionKey: false
})

const couponModel = mongoose.model("coupon", couponSchema)

export default couponModel