import { Router } from "express";
import { Product } from "../models/ecommerce/product.models.js";
import { Category } from "../models/ecommerce/category.models.js";
import { User } from "../models/ecommerce/user.models.js";

const router=Router();

router.post('/add',async(req,res)=>{  //by admin
    try {
        const {name,description,price,stock,category,owner,productImage}=req.body;
        if (!name || !description || !category|| !owner) {
            return res.status(400).json({ error: "Name, description, and category are required." });
        }
        const existingCategory=await Category.findOne({name:category});
        if(!existingCategory){
            return res.status(401).json({message:"Category not found"});
        }
        console.log("Saving product with category ID:", existingCategory._id);
        const existingOwner=await User.findOne({username:owner});
        if(!existingOwner){
            return res.status(401).json({message:"Owner not found"});
        }
        if(existingOwner.role!=="admin"){
            return res.status(401).json({message:"You are not an owner,you can't add a product"})
        }

        const newProduct=new Product({
            name,
            description,
            price,
            stock,
            category:existingCategory._id,
            owner:existingOwner._id,
            productImage,
        });
        const savedProduct= await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error:",error);
        res.status(500).json({message:"Error in creating product"});
    }
})

router.get("/getAllProduct",async(req,res)=>{
    try{
        const products=await Product.find().
        populate("category","name").
        populate("owner","username email");
         return res.status(200).json(products);
    }
    catch(error){
        console.error("Error:",error);
        return res.status(500).json({message:"Error in fetching data"});
    }
})
router.get("/getProductByCategory/:id",async(req,res)=>{
    const {id}=req.params;
    try{
        const category = await Category.findById(id);
        if(!category){
            return res.status(400).json({message:"No category found"});
        }
        const products=await Product.find({category:id}).
        populate("category","name").
        populate("owner","username email");
        if(!products){
            return res.status(400).json({message:"No products found in this category"});
        }
        return res.status(200).json({categoryName:category.name,products});
    }
    catch(error){
        console.error("Error:",error);
        return res.status(500).json({message:"Error in fetching data"});
    }
})
router.get("/getProductById/:productId",async(req,res)=>{
    try{
        const {productId}=req.params;
        const products=await Product.findById(productId)
        .populate("category","name").populate("owner","username email");
        if (!products) {
            return res.status(404).json({ message: "Product not found." });
    }
        return res.status(200).json(products);
    }
    catch(error){
        console.error("Error:",error);
        return res.status(500).json({message:"Error in finding product"});
    }
})
router.get('/getProductByUserId/:userId',async(req,res)=>{ //admin
    const {userId}=req.params;
    try{
        const products=await Product.find({owner:userId})
        .populate("category","name").populate("owner","username");
        if(!products){
            return res.status(400).json({message:"No products"});
        }
        return res.status(200).json(products);
    }
    catch(error){
        console.error("Error:",error);
        return res.status(500).json({message:"Internal server error"})
    }
})
router.put('/updateProduct/:productId',async(req,res)=>{  //by admin
    const {productId}=req.params;
    const {name,description,price,stock}=req.body;
    try {
        const updatedData={};
        const product=await Product.findById(productId).populate("category","name").populate("owner","username email");
        if(!product){
            return res.status(404).json({ message: "Product not found." });
        }
        if(name!==undefined){
            updatedData.name=name;
        }
        if(description!==undefined){
            updatedData.description=description;
        }
        if(price!==undefined){
            updatedData.price=price;
        }
        if(stock!==undefined){
            updatedData.stock=stock;
        }
        Object.assign(product,updatedData);
        await product.save();
        return res.status(200).json({message:"updated successfully"});
    } catch (error) {
        console.error("Error:",error);
        return res.status(500).json({message:"Error in updating product"});
    }
})
router.delete('/delete/:id',async(req,res)=>{
    const {id}=req.params;
    try{
        const deletedProduct=await Product.findByIdAndDelete(id);
        if(!deletedProduct){
            return res.status(404).json({message:"Product not found"});
        }
        res.status(200).json({message:"Product deleted Successfully"});
    }
    catch(error){
        console.error("Error deleting product:",error);
        res.status(500).json({message:"Server error while deleting product"});
    }
})
export default router;