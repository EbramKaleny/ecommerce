import cloudinary from "../service/cloudinary.js"

export const deleteFromDB = async(req,res,next)=>{
    if(req?.data){
        const {model, data} = req.data
        await model.deleteOne({_id:id})
    }
}