import { Router } from "express";
import { User } from "../models/ecommerce/user.models.js";

const router=Router();

router.post("/register",async(req,res)=>{
    const {username,email,password,role}=req.body;
    try{
        if(!username||!email||!password){
            return res.status(400).json({error:"All fields are required"});
        }
        console.log("email:",email);
        const existingUser=await User.findOne({
            $or:[{username},{email}]
        });
        if(existingUser){
            return res.status(400).json({message:"Username already exists"});
        }
        const user=await User.create({username,email,password,role});
        res.status(201).json({message:"User registered:",user});
    }catch(err){
        console.log("Registration error:",err);
        res.status(500).json({error:"Internal server error"})
    }
})

router.post("/login",async(req,res)=>{
    const {username,password}=req.body;
    try{
        if(!username||!password){
            return res.status(400).json({message:"All fields are required"});
        }
        const existingUser=await User.findOne({username})
        if(!existingUser){
            return res.status(404).json({message:"User doesnt exist"});
        }

        if(password!=existingUser.password){
            return res.status(401).json({message:"Invalid password"});
        }
        
        res.status(200).json({
            message: "Login successful",
            existingUser: {
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                fullName: existingUser.fullName || "",
                gender: existingUser.gender || "",
                mobileNum: existingUser.mobileNum || "",
                role:existingUser.role
            }
        });

        console.log(existingUser)

    }catch(error){
        console.log("Login error:",err);
        res.status(500).json({error:"Internal server error"})
    }
})

export default router;