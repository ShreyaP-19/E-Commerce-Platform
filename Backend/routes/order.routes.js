import { Router } from "express";
import { Order } from "../models/ecommerce/order.models.js";
import { Product } from "../models/ecommerce/product.models.js";
import { User } from "../models/ecommerce/user.models.js";
import mongoose from "mongoose";
const router=Router();

router.post('/add',async(req,res)=>{
    try {
        const {customer,orderItems,address}=req.body;
        if(!customer || !orderItems ||!Array.isArray(orderItems) || orderItems.length===0 ||!address){
            return res.status(400).json({message:"Missing required fields"});
        }
        const existingCustomer=await User.findOne({username:customer});
        if(!existingCustomer){
            return res.status(401).json({message:"Customer not found"});
        }
        let totalOrderPrice=0;
        const formattedOrderItems = [];
        for(let item of orderItems){
            const existingProduct=await Product.findOne({name:item.product});
            if(!existingProduct){
                return res.status(404).json({message:`Product not found:${item.product}`});
            }
            if(existingProduct.stock<item.quantity){
                return res.status(400).json({message:`Out of stock:${item.product}`});
            }

            formattedOrderItems.push({
                product: existingProduct._id,
                quantity: item.quantity
            });
            totalOrderPrice+=existingProduct.price*item.quantity;
            existingProduct.stock -= item.quantity;
            await existingProduct.save();
        }
        const newOrder=new Order({
            customer:existingCustomer._id,
            orderItems:formattedOrderItems,
            address,
            orderPrice:totalOrderPrice
        });
        const savedOrder=await newOrder.save();
        return res.status(201).json({
            message: "Order placed successfully",
            order: savedOrder
        });
    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})
router.get('/getOrderById/:id',async(req,res)=>{  //by admin?
    const {id}=req.params;
    try{
        const order=await Order.findById(id).
        populate("customer","username email")
        if(!order){
            return res.status(401).json({message:"Order not placed"});
        }
        return res.status(200).json(order);
    }
    catch(error){
        console.error("Error fetching order details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})
router.get('/getOrderByUser/:id',async(req,res)=>{
    const {id}=req.params;
    // console.log("Received ID:", id, typeof id);
    try{
        const objectId = new mongoose.Types.ObjectId(id);
        const order=await Order.find({customer:objectId}).
        populate("customer","username email").populate("orderItems.product","name description price")
        // populate("orderItems.productId", "name price");
        if(!order || order.length === 0){
            return res.status(401).json([]);
        }
        return res.status(200).json(order);
    }
    catch(error){
        console.error("Error fetching order details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})
router.put('/updateStatus/:id',async(req,res)=>{ //only by admin
    const {id}=req.params;
    const {user,sendStatus}=req.body;
    console.log("Status came:",sendStatus);
    let status="";
    try{
        const order=await Order.findById(id).populate("customer","username email role");
        if(!order){
            return res.status(400).json({message:"No order found"});
        }
        const existingUser=await User.findById(user);
        if(!existingUser){
            return res.status(401).json({message:"No such user"});
        }
        if(existingUser.role!=="admin"){
            return res.status(400).json({message:"You are not an admin"});
        }
        if(sendStatus==="deliver" && order.status!=="CANCELLED"){
            status="DELIVERED";
        }
        else if(sendStatus==="cancel" && order.status!=="DELIVERED"){
            status="CANCELLED"
        }
        else{
            status="PENDING";
        }
        const updatedStatus=await Order.findByIdAndUpdate(
            id,
            {status},
            {new :true}
        ).populate("customer","username email");
        if (!updatedStatus) {
      return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({
            message: "Order status updated successfully",
            order: updatedStatus
        });
    }
    catch(error){
        console.error("Error updating order status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})
router.put('/cancelOrder/:id',async(req,res)=>{
    const {id}=req.params;
    const status="CANCELLED"
    try{
        const order=await Order.findById(id).populate("customer","username email role");
        if(!order){
            return res.status(400).json({message:"No order found"});
        }
        const updatedStatus=await Order.findByIdAndUpdate(
            id,
            {status},
            {new :true}
        ).populate("customer","username email");
        if (!updatedStatus) {
      return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({
            message: "Order status updated successfully",
            order: updatedStatus
        });
    }
    catch(error){
        console.error("Error updating order status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})
router.get('/getOrderOfOwnerProduct/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Fetch all orders and populate product & owner
    const orders = await Order.find()
      .populate({
        path: 'orderItems.product',
        populate: {
          path: 'owner',
          model: 'User'
        }
      });

    // Step 2: Filter orders that contain at least one product owned by the user
    const filteredOrders = orders.filter(order =>
      order.orderItems.some(item =>
        item.product?.owner?._id.toString() === id
      )
    );

    res.status(200).json(filteredOrders);
  } catch (err) {
    console.error("Error fetching owner orders:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;