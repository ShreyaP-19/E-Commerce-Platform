import { Router } from "express";
import { Product } from "../models/ecommerce/product.models.js";
import { Cart } from "../models/ecommerce/cart.models.js";
// import { User } from "../models/ecommerce/user.models.js";
const router=Router();

router.post('/addToCart',async(req,res)=>{
    const { productId,quantity, userId } = req.body;
    try{
        const product=await Product.findById(productId)
        if(!product){
            return res.status(400).json({message:"No such product"});
        }
        const cartItem=new Cart({
            user:userId,
            product:productId,
            quantity
        });
        const savedCartItem= await cartItem.save();
        res.status(201).json(savedCartItem);
    } catch (error) {
        console.error("Error:",error);
        res.status(500).json({message:"Error in adding product to cart"});
    }
})
router.get('/getProducts/:userId',async(req,res)=>{
    const {userId}=req.params;
    try{
        const product=await Cart.find({user:userId})
        .populate("product")
        .populate("user");
        if(!product || product.length===0){
            return res.status(400).json({message:"No products on cart for the user"});
        }
        return res.status(200).json(product);
    }catch(error){
        console.error("error in fetching products from cart",error);
        return res.status(500).json({message:"Internal server error"});
    }
})

export default router;