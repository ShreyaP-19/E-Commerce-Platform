import connectDB from './db/index1.js';
import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from "cors";

dotenv.config({
})

const app=express();
const port=process.env.PORT||4000;

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

// app.use(express.json({limit:"16kb" }))
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser())

import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import productRouter from './routes/product.routes.js'
import categoryRouter from './routes/category.routes.js'
import orderRouter from './routes/order.routes.js'
import cartRouter from './routes/cart.routes.js'

app.use("/users",userRouter);
app.use("/auth",authRouter);
app.use("/product",productRouter);
app.use("/category",categoryRouter);
app.use("/order",orderRouter);
app.use("/cart",cartRouter);

connectDB().
then(()=>{
    app.get('/',(req,res)=>{
        res.send('hi');
    })        
    
    app.listen(port,()=>{
        console.log(`Server running on ${port}`);
    })
}).
catch((err)=>{
    console.log("MONGODB connection failed!",err);
})