// routes/userRoutes.js
import express from 'express';
import { User } from '../models/ecommerce/user.models.js';
import { Product } from '../models/ecommerce/product.models.js';

const router = express.Router();

router.put('/profile/:userId',async (req,res)=>{
    const {userId}=req.params;
    const {fullName,gender,mobileNum}=req.body;
    try{
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        console.log("Requested Body:",req.body);
        console.log("Fullname:",fullName," Gender:",gender," MobileNum:",mobileNum);
        const updatedData={};
        if(fullName!==undefined){
            updatedData.fullName=fullName;
        }
        if(gender!==undefined){
            updatedData.gender=gender;
        }
        if(mobileNum!==undefined){
            updatedData.mobileNum=mobileNum;
        }
        Object.assign(user,updatedData);
        await user.save();
        res.status(201).json({message:"Profile updated successfully"});
    }
    catch(error){
        console.log("Error:",error);
        return res.status(500).json({message:"Internal Server error"})
    }
    // return res.status(200).json({message:"ok"})

});

router.delete('/delete/:id',async(req,res)=>{
    const {id}=req.params;
    try{
        const deletedUser=await User.findByIdAndDelete(id);
        if(!deletedUser){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({message:"User deleted Successfully"});
    }
    catch(error){
        console.error("Error deleting user:",error);
        res.status(500).json({message:"Server error while deleting user"});
    }
})

router.get('/search',async(req,res)=>{
    try{
        const {keyword}=req.query;
        console.log("query is ",keyword);
        if(!keyword){
            return res.status(400).json({message:"Keyword is required"});
        }
        const products=await Product.find({$or: [{ name: {$regex: keyword, $options: "i" } },{ description: { $regex: keyword, $options: "i" } }
        ]}).populate("category","name").populate("owner","username"); 
        if(products.length===0){
            return res.status(404).json({message:"No products found"});
        }
        res.status(200).json(products);
    }
    catch(error){
        console.error("Error searching products:", error);
        res.status(500).json({ message: "Server Error" });
    }
})

export default router;
