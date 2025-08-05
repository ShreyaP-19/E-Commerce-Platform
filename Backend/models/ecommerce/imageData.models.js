import mongoose, { Mongoose } from "mongoose";
const imageSchema=new mongoose.Schema(
    {
        image:{
            type:String,
            required:true
        },
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    },
    {timestamps:true}
)
export const ImageData=mongoose.model("ImageData",imageSchema)