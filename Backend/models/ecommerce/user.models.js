import mongoose from "mongoose";
const userSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        fullName:{
            type:String
        },
        mobileNum:{
            type:String
        },
        gender:{
            type:String,
            enum:["M","F","O"]
        },
        role:{
            type:String,
            enum:["admin","customer"],
            default:"customer"
        }
    },
    {timestamps:true}
);

export const User=mongoose.model("User",userSchema);