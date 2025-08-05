import { Router } from "express";
import { Category } from "../models/ecommerce/category.models.js";
import { Product } from "../models/ecommerce/product.models.js";
const router=Router();

router.post('/add',async (req,res)=>{   //by admin
    const {name}=req.body;
    if(!name){
        return res.status(400).json({message:"Category name is required"});
    }
    try {
        const existing=await Category.findOne({name:name.trim()});
        if(existing){
            return res.status(400).json({message:"Category already exists"});
        }
        const newCategory=new Category({name:name.trim()});
        await newCategory.save();
        return res.status(200).json({message:"Category created successfully"});
    } catch (error) {
        console.error("Error in creating category",error);
        return res.status(501).json({message:"Error"});
    }
})
router.get('/getAllCategory',async(req,res)=>{
    try {
        const categories=await Category.find();
        if(!categories){
            return res.status(401).json({message:"No category found"});
        }
        return res.status(200).json(categories);
    } catch (error) {
        console.error("Error in fetching category",error);
        return res.status(501).json({message:"Error"});
    }
})
router.delete('/delete/:id',async(req,res)=>{
    const {id}=req.params;
    try{
        await Product.deleteMany({category:id});
        const deletedCategory=await Category.findByIdAndDelete(id);
        if(!deletedCategory){
            return res.status(400).json({message:"Category not found"});
        }
        return res.status(200).json({message:"Category and its products deleted successfully"});
    }
    catch (error) {
        console.error('Error deleting category and products:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

export default router;